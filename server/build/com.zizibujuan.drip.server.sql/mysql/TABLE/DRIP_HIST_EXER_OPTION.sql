-- -----------------------------------------------------
-- Table `DRIP_HIST_EXER_OPTION` 存储习题选项修改历史
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DRIP_HIST_EXER_OPTION`;

CREATE  TABLE IF NOT EXISTS `DRIP_HIST_EXER_OPTION` (
  `DBID` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `HIST_EXER_ID` BIGINT NOT NULL COMMENT '习题标识' ,
  `CONTENT` TEXT NULL COMMENT '可选项内容' ,
  `OPT_SEQ` INT NULL COMMENT '选项次序',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '存储习题的选项或者填空占位符修改历史表';