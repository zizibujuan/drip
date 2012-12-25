-- 注意：在本网站申请的用户，也需要在这个表中插入一条记录，将自己与自己关联起来，
-- 并标识出该用户来自本网站，这样去中心化的设计很灵活。
-- -----------------------------------------------------
-- Table `drip`.`DRIP_OAUTH_USER_MAP` 本网站用户与Oauth授权网站中用户的关联表
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_OAUTH_USER_MAP`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_OAUTH_USER_MAP` (
  `DBID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `OAUTH_SITE_ID` INT NOT NULL COMMENT '第三方网站标识' ,
  `OAUTH_USER_ID` VARCHAR(56) NOT NULL COMMENT '第三方网站的用户标识' ,
  `LOCAL_USER_ID` BIGINT UNSIGNED NOT NULL COMMENT '对应本网站中的用户标识' ,
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '本网站用户与Oauth授权网站中用户的关联表';