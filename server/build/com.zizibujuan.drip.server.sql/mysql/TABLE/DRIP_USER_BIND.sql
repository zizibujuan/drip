-- -----------------------------------------------------
-- Table `DRIP_USER_BIND` 本网站用户绑定的第三方网站帐号
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DRIP_USER_BIND`;

CREATE  TABLE IF NOT EXISTS `DRIP_USER_BIND` (
  `DBID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `SITE_ID` INT NOT NULL COMMENT '第三方网站标识' ,
  `OPEN_ID` VARCHAR(56) NULL COMMENT '作为第三方网站用户的唯一标识,类型为:数字类型/字符串类型，只有第三方网站用户填',
  `USER_ID` BIGINT UNSIGNED NOT NULL COMMENT '本网站用户标识'
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '本网站用户绑定的第三方网站帐号';