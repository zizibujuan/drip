-- -----------------------------------------------------
-- Table `drip`.`DRIP_USER_INFO` 用户表
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_USER_INFO`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_USER_INFO` (
  `DBID` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `LOGIN_NAME` VARCHAR(45) NOT NULL COMMENT '登录名,邮箱/手机号/昵称',
  `NICK_NAME` VARCHAR(32) NULL COMMENT '昵称',
  `EMAIL` VARCHAR(100) NULL COMMENT '邮箱',
  `MOBILE` VARCHAR(12) NULL COMMENT '手机号码',
  `LOGIN_PWD` VARCHAR(45) NULL COMMENT '登录密码，加密' ,
  `REAL_NAME` VARCHAR(32) NULL COMMENT '真实姓名',
  `ID_CARD` VARCHAR(32) NULL COMMENT '身份证号',
  `SEX` CHAR(1) NULL COMMENT '性别',
  `BLOOD` CHAR(1) NULL COMMENT '血型',
  `BIRTHDAY` DATETIME NULL COMMENT '出生日期',
  `INTRODUCE` VARCHAR(512) NULL COMMENT '自我介绍',
  
  `LIVE_CITY` VARCHAR(6) NULL COMMENT '现居地',
  `HOME_CITY` VARCHAR(6) NULL COMMENT '家乡',
  
  -- 个人联系方式
  `WEB_SITE` VARCHAR(56) NULL COMMENT '个人网址',
  `QQ` VARCHAR(32) NULL COMMENT 'qq号码',
  `MSN` VARCHAR(32) NULL COMMENT 'msn',
  `WEIBO` VARCHAR(128) NULL COMMENT '新浪微博',
  
  `LAST_LOGIN_TIME` DATETIME NULL COMMENT '最近登录时间' ,
  `FAN_COUNT` INT NULL DEFAULT 0 COMMENT '粉丝数量' ,
  `FOLLOW_COUNT` INT NULL DEFAULT 0 COMMENT '关注人数量' ,
  `EXER_DRAFT_COUNT` INT NULL DEFAULT 0 COMMENT '录入的习题草稿数量' ,
  `EXER_PUBLISH_COUNT` INT NULL DEFAULT 0 COMMENT '录入的已发布习题数量' ,
  `ANSWER_COUNT` INT NULL DEFAULT 0 COMMENT '回答的习题数量' ,
  
  `CREATE_TIME` DATETIME NULL COMMENT '创建时间',
  `ACTIVITY` INT NULL DEFAULT '0' COMMENT '是否激活，默认不激活',
  PRIMARY KEY (`DBID`),
  UNIQUE KEY (`EMAIL`))
ENGINE = InnoDB
COMMENT = '用户表';