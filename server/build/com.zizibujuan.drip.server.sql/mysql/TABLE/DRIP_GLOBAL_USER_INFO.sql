-- 接入第三方网站的用户，存储第三方网站用户的基本信息
-- 第三方网站不会告诉你密码
-- 注意DRIP_CONNECT_USER_INFO,DRIP_USER_INFO和DRIP_OAUTH_USER_MAP
-- 三个表之间的关系，map表本是建立DRIP_CONNECT_USER_INFO和DRIP_USER_INFO表之间的关系
-- 但因为DRIP_CONNECT_USER_INFO中的信息可以即时从第三方服务器获取，并不是必须要的，
-- 所以建立关系时，将MAP中的标识存储在DRIP_CONNECT_USER_INFO中，而不是将DRIP_CONNECT_USER_INFO
-- 中的标识存储在DRIP_OAUTH_USER_MAP。
-- 将必要的信息存储在DRIP_USER_INFO和DRIP_OAUTH_USER_MAP中

-- HOME_CITY是人人专用的临时字段，等把城市编码整理完后，全部用编码表示。

-- FIXME:将本网站的用户信息也存储在这里，这样全局生成一个统一的用户标识。在解决用户关联的问题上有什么好处呢？
-- -----------------------------------------------------
-- Table `drip`.`DRIP_GLOBAL_USER_INFO` 包括本网站注册用户和第三方网站注册用户所有用户信息的表
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_GLOBAL_USER_INFO`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_GLOBAL_USER_INFO` (
  `DBID` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `SITE_ID` INT NOT NULL COMMENT '本网站或第三方网站标识' ,
  `OPEN_ID` VARCHAR(56) NULL COMMENT '作为第三方网站用户的唯一标识,类型为:数字类型/字符串类型，只有第三方网站用户填',
  `DIGITAL_ID` BIGINT UNSIGNED NULL COMMENT '孜孜不倦数字帐号，只有本网站用户才填',
  `LOGIN_PWD` VARCHAR(45) NULL COMMENT '登录密码，加密。只有本网站用户才填',
  `LOGIN_NAME` VARCHAR(56) NULL COMMENT '登录名,邮箱/手机号/昵称',
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
  `ACTIVITY` TINYINT(1) NULL DEFAULT 1 COMMENT '是否激活，默认激活。注意本网站用户如果没有设置密码就不激活',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '包括本网站注册用户和第三方网站注册用户所有用户信息的表';