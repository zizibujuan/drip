package com.zizibujuan.drip.server.util.dao;

import javax.sql.DataSource;

import com.zizibujuan.dbaccess.mysql.service.DataSourceHolder;

/**
 * 所有dao实现类的基类，提供注入和注销DataSourceService的功能，
 * 可以通过DataSourceService获取数据库链接
 * @author jinzw
 * @since 0.0.1
 */
public abstract class AbstractDao {
	protected DataSource getDataSource(){
		return DataSourceHolder.getDefault().getDataSourceService().getDataSource();
	}
}
