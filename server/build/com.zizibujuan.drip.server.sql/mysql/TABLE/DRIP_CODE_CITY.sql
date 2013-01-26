-- -----------------------------------------------------
-- Table `drip`.`DRIP_CODE_CITY` 城市编码
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_CODE_CITY`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_CODE_CITY` (
  `DBID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `CODE` CHAR(9) NOT NULL COMMENT '编码' ,
  `VAL` VARCHAR(52) NULL COMMENT '编码值',
  `I18N_ID` VARCHAR(10) NOT NULL DEFAULT 'zh_cn' COMMENT '国际化代码',
  `IS_VALID` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否有效',
  `CREATE_TIME` DATETIME NOT NULL COMMENT '创建时间' ,
  `UPDATE_TIME` DATETIME NULL COMMENT '更新时间',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '城市编码';