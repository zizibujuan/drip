-- 用户每修改一次，都保存一次。
-- -----------------------------------------------------
-- Table `DRIP_HIST_ANSWER` 习题答案的历史信息表
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DRIP_HIST_ANSWER`;

CREATE  TABLE IF NOT EXISTS `DRIP_HIST_ANSWER` (
  `DBID` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `ANSWER_ID` BIGINT NOT NULL COMMENT '答案标识' ,
  `GUIDE` TEXT NULL COMMENT '答题解析',
  `UPT_TM` DATETIME NULL COMMENT '修改时间',
  `UPT_USER_ID` BIGINT NULL COMMENT '修改人标识',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '习题答案的基本信息修改历史表';