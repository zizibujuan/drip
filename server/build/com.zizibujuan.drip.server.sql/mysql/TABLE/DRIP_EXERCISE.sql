-- -----------------------------------------------------
-- Table `DRIP_EXERCISE` 维护所有的习题
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DRIP_EXERCISE`;

CREATE  TABLE IF NOT EXISTS `DRIP_EXERCISE` (
  `DBID` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `VERSION` INT NOT NULL COMMENT '版本号，从1开始，每次加1, 记录当前版本号' ,
  `CONTENT` TEXT NULL COMMENT '习题内容' ,
  `EXER_TYPE` CHAR(2) NULL COMMENT '题型' ,
  `STATUS` CHAR(2) NULL COMMENT '习题状态,草稿与发布',
  `EXER_COURSE` CHAR(3) NULL COMMENT '所属科目',
  `IMAGE_NAME` VARCHAR(64) NULL COMMENT '附图名称，这个名称是系统生成的uuid，加上文件之前的扩展名',
  `CRT_TM` DATETIME NULL COMMENT '创建时间/贡献时间' ,
  `CRT_USER_ID` BIGINT NOT NULL COMMENT '创建人/贡献者标识,存储全局用户标识',
  `UPT_TM` DATETIME NULL COMMENT '最近一次修改时间',
  `UPT_USER_ID` BIGINT NULL COMMENT '最近一次修改人标识，存储全局用户标识',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '习题';

-- 支持的习题类型 单项选择题，多项选择题，不定项选择题， 填空题，问答题等。