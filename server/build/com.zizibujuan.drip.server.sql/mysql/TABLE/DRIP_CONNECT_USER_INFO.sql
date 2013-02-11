-- 接入第三方网站的用户，存储第三方网站用户的基本信息
-- 第三方网站不会告诉你密码
-- 注意DRIP_CONNECT_USER_INFO,DRIP_USER_INFO和DRIP_OAUTH_USER_MAP
-- 三个表之间的关系，map表本是建立DRIP_CONNECT_USER_INFO和DRIP_USER_INFO表之间的关系
-- 但因为DRIP_CONNECT_USER_INFO中的信息可以即时从第三方服务器获取，并不是必须要的，
-- 所以建立关系时，将MAP中的标识存储在DRIP_CONNECT_USER_INFO中，而不是将DRIP_CONNECT_USER_INFO
-- 中的标识存储在DRIP_OAUTH_USER_MAP。
-- 将必要的信息存储在DRIP_USER_INFO和DRIP_OAUTH_USER_MAP中

-- HOME_CITY是人人专用的临时字段，等把城市编码整理完后，全部用编码表示。
-- -----------------------------------------------------
-- Table `drip`.`DRIP_CONNECT_USER_INFO` 接入第三方网站的用户
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_CONNECT_USER_INFO`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_CONNECT_USER_INFO` (
  `DBID` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `MAP_USER_ID` BIGINT UNSIGNED NOT NULL COMMENT '与第三方网站用户关联的映射信息标识',
  `LOGIN_NAME` VARCHAR(56) NOT NULL COMMENT '登录名,邮箱/手机号/昵称',
  `NICK_NAME` VARCHAR(56) NULL COMMENT '昵称',
  `EMAIL` VARCHAR(100) NULL COMMENT '邮箱',
  `MOBILE` VARCHAR(32) NULL COMMENT '手机号码',
  `ACCESS_TOKEN` VARCHAR(45) NULL COMMENT 'oauth access token',
  `EXPIRES_TIME` INT NULL COMMENT 'access token过期时间',
  `REAL_NAME` VARCHAR(32) NULL COMMENT '真实姓名',
  `ID_CARD` VARCHAR(32) NULL COMMENT '身份证号',
  `SEX` CHAR(1) NULL COMMENT '性别',
  `BLOOD` CHAR(1) NULL COMMENT '血型',
  `BIRTHDAY` DATETIME NULL COMMENT '出生日期',
  `INTRODUCE` VARCHAR(512) NULL COMMENT '自我介绍',
  
  `LIVE_CITY_CODE` CHAR(9) NULL COMMENT '现居城市编码',
  `HOME_CITY_CODE` CHAR(9) NULL COMMENT '家乡所在城市编码',
  `HOME_CITY` VARCHAR(56) NULL COMMENT '家乡所在城市名称，为了防止出现程序对应不上的情况，在这里缓存一份，测试用的列',
  
  `CREATE_TIME` DATETIME NULL COMMENT '创建时间',
  `UPDATE_TIME` DATETIME NULL COMMENT '更新时间',
  `ACTIVITY` TINYINT(1) NULL DEFAULT 1 COMMENT '是否激活，默认激活',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '接入第三方网站的用户';