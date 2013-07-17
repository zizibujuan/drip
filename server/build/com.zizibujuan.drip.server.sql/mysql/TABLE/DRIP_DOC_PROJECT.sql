-- -----------------------------------------------------
-- Table `drip`.`DRIP_DOC_PROJECT` 维护项目信息
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_DOC_PROJECT`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_DOC_PROJECT` (
  `DBID` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `PROJECT_NAME` VARCHAR(32) NULL COMMENT '项目名称' ,
  `PROJECT_LABEL` VARCHAR(56) NULL COMMENT '项目中文名' ,
  `PROJECT_DESC` VARCHAR(512) NULL COMMENT '项目详细描述',
  `CRT_TM` DATETIME NULL COMMENT '创建时间' ,
  `CRT_USER_ID` BIGINT NOT NULL COMMENT '创建人标识',
  PRIMARY KEY (`DBID`),
  UNIQUE KEY `UK_PROJECT_USER_ID` (`PROJECT_NAME`,`CRT_USER_ID`))
ENGINE = InnoDB
COMMENT = '项目信息';