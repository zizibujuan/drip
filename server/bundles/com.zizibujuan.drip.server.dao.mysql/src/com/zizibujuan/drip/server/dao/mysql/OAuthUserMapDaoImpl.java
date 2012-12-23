package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;

import com.zizibujuan.drip.server.dao.OAuthUserMapDao;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 用户关联表 数据访问实现类
 * @author jzw
 * @since 0.0.1
 */
public class OAuthUserMapDaoImpl extends AbstractDao implements OAuthUserMapDao {

	private static final String SQL_GET_DRIP_USER_ID = "SELECT USER_ID FROM DRIP_OAUTH_USER_MAP WHERE OAUTH_SITE_ID=? AND OAUTH_USER_ID=?";
	@Override
	public Long getUserId(int authSiteId, String authUserId) {
		return DatabaseUtil.queryForLong(getDataSource(), SQL_GET_DRIP_USER_ID, authSiteId, authUserId);
	}
	
	private static final String SQL_INSERT_AUTH_USER_MAP = "INSERT INTO DRIP_OAUTH_USER_MAP (OAUTH_SITE_ID,OAUTH_USER_ID,USER_ID) VALUE (?,?,?)";
	@Override
	public Long mapUserId(Connection con, int authSiteId,String authUserId, Long userId) {
		return DatabaseUtil.insert(con, SQL_INSERT_AUTH_USER_MAP, authSiteId, authUserId, userId);
	}

}
