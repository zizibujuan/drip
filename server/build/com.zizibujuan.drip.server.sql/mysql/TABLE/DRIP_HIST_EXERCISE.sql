-- 每修改一次，都将习题所有内容重新保存一次
-- -----------------------------------------------------
-- Table `DRIP_HIST_EXERCISE` 维护习题修改历史
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DRIP_HIST_EXERCISE`;

CREATE  TABLE IF NOT EXISTS `DRIP_HIST_EXERCISE` (
  `DBID` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `EXER_ID` BIGINT NOT NULL COMMENT '习题标识' ,
  `CONTENT` TEXT NULL COMMENT '习题内容' ,
  `EXER_TYPE` CHAR(2) NULL COMMENT '题型' ,
  `EXER_CATEGORY` CHAR(10) NULL COMMENT '所属科目分类',
  `ACTION` CHAR(1) NULL COMMENT '操作代码',
  `UPT_TM` DATETIME NULL COMMENT '修改时间',
  `UPT_USER_ID` BIGINT NULL COMMENT '修改人标识',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '习题修改历史';