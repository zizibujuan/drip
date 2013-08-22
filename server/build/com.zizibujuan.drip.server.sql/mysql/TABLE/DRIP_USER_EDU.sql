-- -----------------------------------------------------
-- Table `DRIP_USER_EDU` 用户教育经历
-- TODO:加入学院和班级
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DRIP_USER_EDU`;

CREATE  TABLE IF NOT EXISTS `DRIP_USER_EDU` (
  `DBID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `GLOBAL_USER_ID` BIGINT UNSIGNED NOT NULL COMMENT '全局用户标识' ,
  `SCHOOL_CODE` CHAR(10) NULL COMMENT '学校编码',
  `SCHOOL_TYPE_CODE` CHAR(1) NULL COMMENT '学校类型编码',
  `YEAR` INT NULL COMMENT '入学年份',
  `CREATE_TIME` DATETIME NOT NULL COMMENT '创建时间' ,
  `UPDATE_TIME` DATETIME NULL COMMENT '更新时间',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '用户教育经历';