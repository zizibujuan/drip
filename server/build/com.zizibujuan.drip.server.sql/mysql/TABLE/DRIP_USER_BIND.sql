-- 支持关联一个网站中的多个用户，如马甲等。
-- 新增本网站用户时，也需要本网站用户自我绑定
-- -----------------------------------------------------
-- Table `drip`.`DRIP_USER_BIND` 本网站用户绑定的第三方网站帐号
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_USER_BIND`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_USER_BIND` (
  `DBID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `LOCAL_USER_ID` BIGINT UNSIGNED NOT NULL COMMENT '为本网站用户生成的全局用户标识' ,
  `BIND_USER_ID` BIGINT UNSIGNED NOT NULL COMMENT '为第三方网站用户生成的全局用户标识',
  `REF_USER_INFO` TINYINT NULL DEFAULT 0 COMMENT '1表示引用；0表示不引用。如果是1，一个LOCAL_USER_ID只能对应一个REF_USER_INFO为1的记录',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '本网站用户与Oauth授权网站中用户的关联表';