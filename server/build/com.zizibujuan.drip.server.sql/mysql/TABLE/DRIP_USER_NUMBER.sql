-- 存储开放的孜孜不倦号码
-- 只有这里写入的号码，用户才可以注册。
-- 当号码库小于一定数量时，后台要报警。
-- 号码从10位的数字开始

-- -----------------------------------------------------
-- Table `DRIP_USER_NUMBER` 孜孜不倦号码库
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DRIP_USER_NUMBER`;

CREATE  TABLE IF NOT EXISTS `DRIP_USER_NUMBER` (
  `DBID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `NUM` BIGINT UNSIGNED NOT NULL COMMENT '孜孜不倦号码',
  `USE_TOKEN` VARCHAR(32) NULL COMMENT '使用标记，用32位uuid标识',
  `CREATE_TIME` DATETIME NULL COMMENT '创建时间',
  `CRT_USER_ID` BIGINT  NULL COMMENT '为后台管理员用户，TODO：添加后台管理员功能',
  `APPLY_TIME` DATETIME NULL COMMENT '被申请时间',
  
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '孜孜不倦号码库';
