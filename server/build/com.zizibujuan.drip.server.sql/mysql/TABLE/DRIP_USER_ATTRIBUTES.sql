-- 用户相关属性表
--
-- 这些字段放在该表中
-- TODO:根据性能测试，决定是否要把一些字段放在这个表中。
-- -----------------------------------------------------
-- Table `drip`.`DRIP_USER_ATTRIBUTES` 用户相关的属性表，主要放置一些统计信息等
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_USER_ATTRIBUTES`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_USER_ATTRIBUTES` (
  `DBID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `USER_ID` BIGINT UNSIGNED NOT NULL COMMENT '本网站用户标识/本网站为第三方网站用户生成的代理主键' ,
  `IS_LOCAL_USER` TINYINT NULL  DEFAULT 0 COMMENT '是否在本网站注册的用户，默认为否0',
  `ATTR_NAME` VARCHAR(255) NULL COMMENT '属性名称',
  `ATTR_VALUE` VARCHAR(255) NULL COMMENT '属性值',
  PRIMARY KEY (`DBID`),
  UNIQUE KEY (`USER_ID`,`ATTR_NAME`, `IS_LOCAL_USER`))
ENGINE = InnoDB
COMMENT = '用户相关的属性表，主要放置一些统计信息等';