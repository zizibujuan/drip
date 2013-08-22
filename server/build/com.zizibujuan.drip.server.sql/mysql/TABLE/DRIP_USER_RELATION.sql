-- 关注的用户标识，可以是本网站用户的标识，也可以是第三方网站用户标识。
-- -----------------------------------------------------
-- Table `DRIP_USER_RELATION` 用户关系表
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DRIP_USER_RELATION`;

CREATE  TABLE IF NOT EXISTS `DRIP_USER_RELATION` (
  `DBID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `USER_ID` BIGINT UNSIGNED NOT NULL COMMENT '用户标识,存储全局用户标识' ,
  `WATCH_USER_ID` BIGINT UNSIGNED NOT NULL COMMENT '关注的用户标识,存储全局用户标识' ,
  `CRT_TM` DATETIME NOT NULL COMMENT '建立关系时间' ,
  PRIMARY KEY (`DBID`),
  UNIQUE KEY (`USER_ID`,`WATCH_USER_ID`))
ENGINE = InnoDB
COMMENT = '用户关系表';