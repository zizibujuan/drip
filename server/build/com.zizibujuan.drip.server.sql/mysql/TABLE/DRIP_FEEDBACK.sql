-- -----------------------------------------------------
-- Table `drip`.`DRIP_FEEDBACK` 搜集用户反馈信息
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_FEEDBACK`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_FEEDBACK` (
  `DBID` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `USER_ID` BIGINT NOT NULL COMMENT '全局用户标识/临时为用户生成的标识' ,
  `ANONYMOUS` TINYINT(1) NULL DEFAULT 1 COMMENT '是否匿名用户',
  `USER_NAME` VARCHAR(50) NULL COMMENT '匿名用户输入的用户名',
  `EMAIL` VARCHAR(20) NULL COMMENT '匿名用户输入的邮箱地址，回复用户时使用',
  `CONTENT` TEXT NULL COMMENT '反馈内容',
  `CRT_TM` DATETIME NULL COMMENT '提交反馈时间',
  `REPLY` TEXT NULL COMMENT '回复的内容，将这些内容发送到用户邮箱中',
  `REPLY_USER_ID` BIGINT NULL COMMENT '回复用户的标识' ,
  `REPLY_TM` DATETIME NULL COMMENT '回复时间' ,
  -- 处理结果
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '用户反馈';