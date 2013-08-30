-- 经过一轮激烈的思想斗争，决定不再将本网站与第三方网站用户之间的关系设计的这么复杂，方案定为：
-- 1. 使用第三方网站用户登录后，创建并激活一个本地用户，然后将第三方网站的用户信息复制一份给本网站用户
-- 2. 所有需要记录操作用户的表，都记录本网站用户标识
-- 3. 如果有多个第三方网站用户关联到同一个本网站用户下，根据两个网站的用户信息，完善本网站用户信息，无法决定的，弹出提示框交由用户填写

-- -----------------------------------------------------
-- Table `DRIP_USER_INFO` 记录本网站用户信息
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DRIP_USER_INFO`;

CREATE  TABLE IF NOT EXISTS `DRIP_USER_INFO` (
  `DBID` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键，全局统一用户标识' ,
  `DIGITAL_ID` BIGINT UNSIGNED NULL COMMENT '孜孜不倦数字帐号',
  `LOGIN_PWD` VARCHAR(45) NULL COMMENT '登录密码，加密',
  `LOGIN_NAME` VARCHAR(56) NULL COMMENT '登录名',
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
  
  `CONFIRM_KEY` VARCHAR(32) NULL COMMENT '邮箱激活时使用的key值',
  `EMAIL_SEND_TIME` DATETIME NULL COMMENT '发送激活邮件的时间，支持重复发送',
  `ACTIVITY` TINYINT(1) NULL DEFAULT 0 COMMENT '是否激活，默认不激活',
  `ACTIVE_TIME` DATETIME NULL COMMENT '激活时间',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '本网站用户信息';