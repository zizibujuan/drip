package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.UserAttributesDao;
import com.zizibujuan.drip.server.exception.dao.DataAccessException;
import com.zizibujuan.drip.server.util.ApplicationPropertyKey;
import com.zizibujuan.drip.server.util.dao.AbstractDao;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 用户统计属性 数据访问实现类
 * 
 * @author jzw
 * @since 0.0.1
 */
public class UserAttributesDaoImpl extends AbstractDao implements UserAttributesDao {

	private static final Logger logger = LoggerFactory.getLogger(UserAttributesDaoImpl.class);
	
	private static final String SQL_UPDATE_LAST_LOGIN_MILLIS = "UPDATE "
			+ "DRIP_USER_ATTRIBUTES "
			+ "SET "
			+ "ATTR_VALUE=UNIX_TIMESTAMP(now()) "
			+ "WHERE "
			+ "USER_ID= %s AND "
			+ "ATTR_NAME='%s'";
	private static final String SQL_UPDATE_LOGIN_COUNT = "UPDATE "
			+ "DRIP_USER_ATTRIBUTES "
			+ "SET "
			+ "ATTR_VALUE=(cast(ATTR_VALUE as SIGNED)+1) "
			+ "WHERE "
			+ "USER_ID= %s AND "
			+ "ATTR_NAME='%s'";
	private static final String SQL_UPDATE_USER_LOGIN_TOKEN = "UPDATE DRIP_USER_INFO SET ACCESS_TOKEN=? WHERE DBID=?";
	@Override
	public void updateLoginState(Long userId, String token) {
		Connection con = null;
		Statement pst = null;
		try{
			con = getDataSource().getConnection();
			con.setAutoCommit(false);
			pst = con.createStatement();
			String lastLogin = String.format(SQL_UPDATE_LAST_LOGIN_MILLIS,userId,ApplicationPropertyKey.LOGIN_LAST_LOGIN_MILLIS);
			pst.addBatch(lastLogin);
			String loginCount = String.format(SQL_UPDATE_LOGIN_COUNT,userId,ApplicationPropertyKey.LOGIN_COUNT);
			pst.addBatch(loginCount);
			pst.executeBatch();
			DatabaseUtil.update(con, SQL_UPDATE_USER_LOGIN_TOKEN, token, userId);
			con.commit();
		}catch(SQLException e){
			DatabaseUtil.safeRollback(con);
			logger.error("初始化用户信息失败，sql语句是:" + SQL_INSERT_USER_ATTRIBUTES, e);
			throw new DataAccessException(e);
		}catch(Exception e){
			DatabaseUtil.safeRollback(con);
			logger.error("初始化用户信息失败，sql语句是:" + SQL_INSERT_USER_ATTRIBUTES, e);
			throw new DataAccessException(e);
		}finally{
			DatabaseUtil.safeClose(con, pst);
		}
		
	}

	private static final String SQL_INSERT_USER_ATTRIBUTES = "INSERT INTO DRIP_USER_ATTRIBUTES " +
			"(USER_ID," +
			"ATTR_NAME," +
			"ATTR_VALUE)" +
			"VALUES(?,?,?)";
	// FIXME:需不需要做一个行列转换，变成一个专门存放用户统计信息或活动信息的表
	@Override
	public void initUserState(Connection con, Long userId) throws SQLException {
		PreparedStatement pst = null;
		try{
			pst = con.prepareStatement(SQL_INSERT_USER_ATTRIBUTES);
			pst.setLong(1, userId);
			pst.setString(2, ApplicationPropertyKey.LOGIN_LAST_LOGIN_MILLIS);
			pst.setString(3, String.valueOf(new Date().getTime()));
			pst.addBatch();
			
			pst.setLong(1, userId);
			pst.setString(2, ApplicationPropertyKey.INVALID_PASSWORD_ATTEMPTS);
			pst.setString(3, "0");
			pst.addBatch();
			
			pst.setLong(1, userId);
			pst.setString(2, ApplicationPropertyKey.LOGIN_COUNT);
			pst.setString(3, "0");
			pst.addBatch();
			
			pst.executeBatch();
		}catch(SQLException e){
			logger.error("初始化用户信息失败，sql语句是:" + SQL_INSERT_USER_ATTRIBUTES, e);
			throw e;
		}finally{
			DatabaseUtil.closeStatement(pst);
		}
	}

}
