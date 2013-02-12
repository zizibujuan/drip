package com.zizibujuan.drip.server.dao.mysql;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.zizibujuan.drip.server.dao.ApplicationPropertyDao;
import com.zizibujuan.drip.server.util.CodeRule;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 系统属性 数据访问实现类。
 * 注意property_key值必须唯一。
 * 系统属性值，都是必须有默认值的。
 * @author jinzw
 * @since 0.0.1
 */
public class ApplicationPropertyDaoImpl extends AbstractDao implements
		ApplicationPropertyDao {

	private static final String SQL_GET_PROPERTY_LONG_VALUE = "SELECT b.PROPERTY_VALUE FROM " +
			"DRIP_PROPERTY_KEY a, DRIP_PROPERTY_VALUE_NUMBER b " +
			"WHERE a.DBID = b.KEY_ID AND a.PROPERTY_KEY=?";
	@Override
	public Long getLong(String propertyName) {
		return DatabaseUtil.queryForLong(getDataSource(), SQL_GET_PROPERTY_LONG_VALUE, propertyName);
	}

	private static final String SQL_UPDATE_LONG_VALUE = "UPDATE DRIP_PROPERTY_VALUE_NUMBER set PROPERTY_VALUE=? where KEY_ID=(SELECT DBID FROM DRIP_PROPERTY_KEY WHERE PROPERTY_KEY=?)";
	@Override
	public void putLong(String propertyName, Long value) {
		DatabaseUtil.update(getDataSource(), SQL_UPDATE_LONG_VALUE, value, propertyName);
	}
	
	@Override
	public void addGroup(String groupName, String displayName, Locale locale) {
		// TODO Auto-generated method stub
		
	}

	private static final String SQL_GET_PROPERTY_STRING_VALUE = "SELECT b.PROPERTY_VALUE FROM " +
			"DRIP_PROPERTY_KEY a, DRIP_PROPERTY_VALUE_STRING b " +
			"WHERE a.DBID = b.KEY_ID AND a.PROPERTY_KEY=?";
	@Override
	public String getForString(String propertyName) {
		return DatabaseUtil.queryForString(getDataSource(), SQL_GET_PROPERTY_STRING_VALUE, propertyName);
	}

	private static final String SQL_GET_CITY_CODE_BY_VALUE = "SELECT CODE FROM DRIP_CODE_CITY WHERE VAL = ?";
	@Override
	public String getCityCodeByValue(String cityName) {
		return DatabaseUtil.queryForString(getDataSource(), SQL_GET_CITY_CODE_BY_VALUE, cityName);
	}

	private static final String SQL_GET_CITY_VAL_BY_CODE = "SELECT VAL FROM DRIP_CODE_CITY WHERE CODE = ?";
	@Override
	public Map<String, Object> getCity(String cityCode) {
		String rule = "000,00,00,00";
		String[] key = {"country","province","city","county"};
		
		Map<String,Object> result = new HashMap<String, Object>();
		CodeRule cr = new CodeRule(rule);
		List<String> levels = cr.parse(cityCode);
		int size = levels.size();
		for(int i = 0; i < size; i++){
			String value = DatabaseUtil.queryForString(getDataSource(), SQL_GET_CITY_VAL_BY_CODE, levels.get(i));
			result.put(key[i], value);
		}
		return result;
	}

}
