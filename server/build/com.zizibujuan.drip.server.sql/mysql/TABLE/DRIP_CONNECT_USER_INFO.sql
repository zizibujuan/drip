-- 接入第三方网站的用户，存储第三方网站用户的基本信息
-- 第三方网站不会告诉你密码

-- -----------------------------------------------------
-- Table `drip`.`DRIP_CONNECT_USER_INFO` 接入第三方网站的用户
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_CONNECT_USER_INFO`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_CONNECT_USER_INFO` (
  `DBID` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `USER_MAP_ID` BIGINT UNSIGNED NOT NULL COMMENT '与第三方网站用户关联的映射信息标识' ,
  `LOGIN_NAME` VARCHAR(56) NOT NULL COMMENT '登录名,邮箱/手机号/昵称',
  `NICK_NAME` VARCHAR(56) NULL COMMENT '昵称',
  `EMAIL` VARCHAR(100) NULL COMMENT '邮箱',
  `MOBILE` VARCHAR(32) NULL COMMENT '手机号码',
  `ACCESS_TOKEN` VARCHAR(45) NULL COMMENT '访问标识' ,
  `REAL_NAME` VARCHAR(32) NULL COMMENT '真实姓名',
  `ID_CARD` VARCHAR(32) NULL COMMENT '身份证号',
  `SEX` CHAR(1) NULL COMMENT '性别',
  `BLOOD` CHAR(1) NULL COMMENT '血型',
  `BIRTHDAY` DATETIME NULL COMMENT '出生日期',
  `INTRODUCE` VARCHAR(512) NULL COMMENT '自我介绍',
  
  `LIVE_CITY` VARCHAR(6) NULL COMMENT '现居地',
  `HOME_CITY` VARCHAR(6) NULL COMMENT '家乡',
  
  `CREATE_TIME` DATETIME NULL COMMENT '创建时间',
  `UPDATE_TIME` DATETIME NULL COMMENT '更新时间',
  `ACTIVITY` TINYINT(1) NULL DEFAULT 1 COMMENT '是否激活，默认激活',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '接入第三方网站的用户';