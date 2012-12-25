-- 用户活动列表
-- -----------------------------------------------------
-- Table `drip`.`DRIP_ACTIVITY` 用户活动列表
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_ACTIVITY`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_ACTIVITY` (
  `DBID` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `LOCAL_USER_ID` BIGINT NOT NULL COMMENT '活动用户标识，本地用户标识' ,
  `MAP_USER_ID` BIGINT NOT NULL COMMENT '活动用户标识,存储与第三方网站映射的关联标识,即使是本地用户也存储映射标识' ,
  `ACTION_TYPE` CHAR(4) NOT NULL COMMENT '活动类型，不同类型的活动存储在不同的表中',
  `IS_IN_HOME` TINYINT(1) NULL COMMENT '是否在个人首页显示',
  `CONTENT_ID` BIGINT NULL COMMENT '活动输出的内容标识',
  `CRT_TM` DATETIME NULL COMMENT '创建时间' ,
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '用户活动列表';