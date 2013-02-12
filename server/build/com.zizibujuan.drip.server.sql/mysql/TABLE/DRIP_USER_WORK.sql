-- -----------------------------------------------------
-- Table `drip`.`DRIP_USER_WORK` 用户工作经历
-- 公司名称，在职时间，工作内容，所属行业
-- 公司编码和公司描述
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_USER_WORK`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_USER_WORK` (
  `DBID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `USER_ID` BIGINT UNSIGNED NOT NULL COMMENT '本网站用户标识/本网站为第三方网站用户生成的代理主键' ,
  `IS_LOCAL_USER` TINYINT NULL  DEFAULT 0 COMMENT '是否在本网站注册的用户，默认为否0',
  `SCHOOL_CODE` CHAR(10) NULL COMMENT '学校编码',
  `SCHOOL_TYPE_CODE` CHAR(1) NULL COMMENT '学校类型编码',
  `YEAR` INT NULL COMMENT '入学年份',
  `CREATE_TIME` DATETIME NOT NULL COMMENT '创建时间',
  `UPDATE_TIME` DATETIME NULL COMMENT '更新时间',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '用户工作经历';