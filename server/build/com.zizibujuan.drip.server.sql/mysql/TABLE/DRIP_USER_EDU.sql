-- -----------------------------------------------------
-- Table `drip`.`DRIP_USER_EDU` 用户教育经历
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_USER_EDU`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_USER_EDU` (
  `DBID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `USER_MAP_ID` BIGINT UNSIGNED NOT NULL COMMENT '与第三方网站用户关联的映射信息标识' ,
  `SCHOOL_CODE` CHAR(10) NULL COMMENT '学校编码',
  `SCHOOL_TYPE_CODE` CHAR(1) NULL COMMENT '学校类型编码',
  `YEAR` INT NULL COMMENT '入学年份',
  `CREATE_TIME` DATETIME NOT NULL COMMENT '创建时间' ,
  `UPDATE_TIME` DATETIME NULL COMMENT '更新时间',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '用户教育经历';