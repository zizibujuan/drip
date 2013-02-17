-- -----------------------------------------------------
-- Table `drip`.`DRIP_USER_AVATAR` 存储用户图像信息
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_USER_AVATAR`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_USER_AVATAR` (
  `DBID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `GLOBAL_USER_ID` BIGINT UNSIGNED NOT NULL COMMENT '全局用户标识' ,
  `URL_NAME` VARCHAR(32) NOT NULL COMMENT '链接名称' ,
  `WIDTH` INT NOT NULL COMMENT '宽度，单位像素' ,
  `HEIGHT` INT NOT NULL COMMENT '宽度，单位像素' ,
  `URL` VARCHAR(512) NOT NULL COMMENT '链接地址' ,
  `CREATE_TIME` DATETIME NULL COMMENT '创建时间' ,
  `UPDATE_TIME` DATETIME NULL COMMENT '更新时间',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '存储用户图像信息';