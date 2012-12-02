
-- -----------------------------------------------------
-- Table `drip`.`DRIP_OAUTH_USER_MAP` 本网站用户与Oauth授权网站中用户的关联表
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_OAUTH_USER_MAP`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_OAUTH_USER_MAP` (
  `DBID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `OAUTH_SITE_ID` INT NOT NULL COMMENT '第三方网站标识' ,
  `OAUTH_USER_ID` VARCHAR(56) NOT NULL COMMENT '第三方网站的用户标识' ,
  `USER_ID` BIGINT UNSIGNED NOT NULL COMMENT '对应本网站中的用户标识' ,
  PRIMARY KEY (`DBID`),
  UNIQUE KEY (`USER_ID`))
ENGINE = InnoDB
COMMENT = '本网站用户与Oauth授权网站中用户的关联表';