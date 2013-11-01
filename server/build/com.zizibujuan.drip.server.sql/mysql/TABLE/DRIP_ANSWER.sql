-- 习题答案的基本信息
-- -----------------------------------------------------
-- Table `DRIP_ANSWER` 习题答案的基本信息，这里存储用户对某个习题最后一次录入的答案
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DRIP_ANSWER`;

CREATE  TABLE IF NOT EXISTS `DRIP_ANSWER` (
  `DBID` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `ANSWER_VERSION` INT NOT NULL COMMENT '版本号，从1开始，每编辑一次答案加1, 记录当前版本号' ,
  `EXER_ID` BIGINT NOT NULL COMMENT '习题标识' ,
  `EXER_VERSION` INT NOT NULL COMMENT '最后一次回答对应哪个版本的习题',
  `GUIDE` TEXT NULL COMMENT '答题解析',
  `CRT_TM` DATETIME NULL COMMENT '创建时间' ,
  `CRT_USER_ID` BIGINT NOT NULL COMMENT '创建人标识,存储全局用户标识',
  `UPT_TM` DATETIME NULL COMMENT '最近一次修改时间',
  `UPT_USER_ID` BIGINT NULL COMMENT '最近一次修改人标识，存储全局用户标识',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '习题答案的基本信息';