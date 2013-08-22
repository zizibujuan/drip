-- 用户相关属性表
--
-- 这些字段放在该表中
-- TODO:根据性能测试，决定是否要把一些字段放在这个表中。
-- -----------------------------------------------------
-- Table `DRIP_USER_ATTRIBUTES` 用户相关的属性表，主要放置一些统计信息等
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DRIP_USER_ATTRIBUTES`;

CREATE  TABLE IF NOT EXISTS `DRIP_USER_ATTRIBUTES` (
  `DBID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `GLOBAL_USER_ID` BIGINT UNSIGNED NOT NULL COMMENT '全局用户标识' ,
  `ATTR_NAME` VARCHAR(255) NULL COMMENT '属性名称',
  `ATTR_VALUE` VARCHAR(255) NULL COMMENT '属性值',
  PRIMARY KEY (`DBID`),
  UNIQUE KEY (`GLOBAL_USER_ID`,`ATTR_NAME`))
ENGINE = InnoDB
COMMENT = '用户相关的属性表，主要放置一些统计信息等';