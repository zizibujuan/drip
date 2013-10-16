-- 把经常使用的字段都放在这个表里，避免联合查询
-- -----------------------------------------------------
-- Table `DRIP_USER_STATISTICS` 用户相关的统计信息
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DRIP_USER_STATISTICS`;

CREATE  TABLE IF NOT EXISTS `DRIP_USER_STATISTICS` (
  `DBID` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `USER_ID` INT NOT NULL COMMENT '本网站用户标识' ,
  `FAN_COUNT` INT NULL DEFAULT 0 COMMENT '粉丝数量' ,
  `FOLLOW_COUNT` INT NULL DEFAULT 0 COMMENT '关注人数量' ,
  `EXER_DRAFT_COUNT` INT NULL DEFAULT 0 COMMENT '录入的习题草稿数量' ,
  `EXER_PUBLISH_COUNT` INT NULL DEFAULT 0 COMMENT '录入的已发布习题数量' ,
  `ANSWER_COUNT` INT NULL DEFAULT 0 COMMENT '回答的习题数量' ,  
  `DOC_COMMIT_COUNT` INT NULL DEFAULT 0 COMMENT '文档提交次数' ,
  PRIMARY KEY (`DBID`),
  UNIQUE KEY `UK_USER_ID` (`USER_ID`) )
ENGINE = InnoDB
COMMENT = '用户表信息统计表';