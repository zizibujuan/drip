package com.zizibujuan.drip.server.util.dao;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * 将从数据库中查询出的{@link ResultSet}映射到pojo对象上
 * @author jzw
 * @since 0.0.1
 * 
 * @param <T> pojo对象
 */
public interface RowMapper<T> {
	T mapRow(ResultSet rs, int rowNum) throws SQLException;
}
