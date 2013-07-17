package com.zizibujuan.dbaccess.mysql.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.dbaccess.mysql.service.DataSourceService;

/**
 * 放置dao层通用的实例对象
 * @author jzw
 * @since 0.0.1
 */
public class DataSourceHolder {

	private static final Logger logger = LoggerFactory
			.getLogger(DataSourceHolder.class);

	private static DataSourceHolder singleton;

	public static DataSourceHolder getDefault() {
		return singleton;
	}

	public void activate() {
		singleton = this;
	}

	public void deactivate() {
		singleton = null;
	}
	
	
	private DataSourceService dataSourceService;
	
	public void unsetDataSourceService(DataSourceService dataSourceService) {
		logger.info("注销datasourceService");
		if(this.dataSourceService == dataSourceService){
			this.dataSourceService = null;
		}
	}
	
	public void setDataSourceService(DataSourceService dataSourceService) {
		logger.info("注入datasourceService");
		logger.info(dataSourceService.toString());
		this.dataSourceService = dataSourceService;
	}
	
	public DataSourceService getDataSourceService(){
		return this.dataSourceService;
	}
	
}
