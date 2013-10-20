package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.UserAvatarDao;
import com.zizibujuan.drip.server.model.Avatar;
import com.zizibujuan.drip.server.util.dao.AbstractDao;
import com.zizibujuan.drip.server.util.dao.BatchPreparedStatementSetter;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 用户头像信息 数据访问实现类。
 * 支持访问使用Oauth获取的第三方网站的用户头像
 * 
 * @author jzw
 * @since 0.0.1
 */
public class UserAvatarDaoImpl extends AbstractDao implements UserAvatarDao {
	
	private static final Logger logger = LoggerFactory.getLogger(UserAvatarDaoImpl.class);

	private static final String SQL_INSERT_USER_AVATAR = "INSERT INTO "
			+ "DRIP_USER_AVATAR "
			+ "(USER_ID, "
			+ "URL_NAME, "
			+ "WIDTH, "
			+ "HEIGHT, "
			+ "URL, "
			+ "CREATE_TIME) "
			+ "VALUES "
			+ "(?, ?, ?, ?, ?, now())";
	@Override
	public void add(Connection con, final Long userId, final List<Avatar> avatars) throws SQLException {
		DatabaseUtil.batchUpdate(con, SQL_INSERT_USER_AVATAR, new BatchPreparedStatementSetter() {
			
			@Override
			public void setValues(PreparedStatement ps, int index) throws SQLException {
				Avatar avatar = avatars.get(index);
				ps.setLong(1, userId);
				ps.setObject(2, avatar.getUrlName());
				ps.setObject(3, avatar.getWidth());
				ps.setObject(4, avatar.getHeight());
				ps.setObject(5, avatar.getUrl());
			}
			
			@Override
			public int getBatchSize() {
				return avatars.size();
			}
		});
	}
	
	private static final String[] KEY_AVATAR = {"smallImageUrl","largeImageUrl", "largerImageUrl","xLargeImageUrl"};
	private static final String SQL_GET_USER_AVATAR = "SELECT "
			+ "URL "
			+ "FROM "
			+ "DRIP_USER_AVATAR "
			+ "WHERE "
			+ "USER_ID=? ORDER BY width";
	@Override
	public Map<String, String> get(Long connectGlobalUserId) {
		Map<String,String> result = new HashMap<String, String>();
		List<Map<String,Object>> list = DatabaseUtil.queryForList(getDataSource(), SQL_GET_USER_AVATAR, connectGlobalUserId);
		int length = KEY_AVATAR.length;
		int listSize = list.size();
		if(listSize > length){
			logger.error("目前系统只支持最多"+length+"种尺寸的头像，但是出现了"+listSize+"种比例的情况，更大尺寸的图像被忽略了");
		}
		if(listSize < length){
			length = listSize;
		}
		for(int i = 0; i < length; i++){
			result.put(KEY_AVATAR[i], list.get(i).get("URL").toString());
		}
		return result;
	}

}
