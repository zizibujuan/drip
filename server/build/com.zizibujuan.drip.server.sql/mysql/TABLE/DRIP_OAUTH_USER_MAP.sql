-- 支持关联一个网站中的多个用户，如马甲等。
-- -----------------------------------------------------
-- Table `drip`.`DRIP_OAUTH_USER_MAP` 本网站用户与Oauth授权网站中用户的关联表
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_OAUTH_USER_MAP`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_OAUTH_USER_MAP` (
  `DBID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `LOCAL_USER_ID` BIGINT UNSIGNED NOT NULL COMMENT '对应本网站中的用户标识,DRIP_USER_INFO.DBID' ,
  `CONNECT_USER_ID` BIGINT UNSIGNED NOT NULL COMMENT '对应第三方网站中的用户标识,DRIP_CONNECT_USER_INFO.DBID',
  `REF_USER_INFO` TINYINT NULL DEFAULT '0' COMMENT '1表示引用；0表示不引用。如果是1，则从DRIP_CONNECT_USER_INFO获取信息，否则从DRIP_USER_INFO获取。一个LOCAL_USER_ID只能对应一个REF_USER_INFO为1的记录',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '本网站用户与Oauth授权网站中用户的关联表';