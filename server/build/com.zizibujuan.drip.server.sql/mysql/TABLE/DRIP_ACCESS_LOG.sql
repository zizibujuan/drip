-- 用户访问日志
-- -----------------------------------------------------
-- Table `drip`.`DRIP_ACCESS_LOG` 用户访问日志
-- -----------------------------------------------------
DROP TABLE IF EXISTS `drip`.`DRIP_ACCESS_LOG`;

CREATE  TABLE IF NOT EXISTS `drip`.`DRIP_ACCESS_LOG` (
  `DBID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `USER_ID` BIGINT NOT NULL COMMENT '全局用户标识/临时为用户生成的标识' ,
  `IP` VARCHAR(255) NULL COMMENT 'IP地址',
  `ANONYMOUS` TINYINT(1) NULL DEFAULT 1 COMMENT '是否匿名用户',
  `URL_FROM` VARCHAR(1024) NULL COMMENT '来自哪个页面',
  `URL_ACCESS` VARCHAR(255) NULL COMMENT '当前访问本网站的页面',
  `BROWSER` VARCHAR(25) NULL COMMENT '用户使用的浏览器',
  `BROWSER_VERSION` VARCHAR(25) NULL COMMENT '用户使用的浏览器版本号',
  `OS` VARCHAR(25) NULL COMMENT '用户使用的操作系统',
  `OS_VERSION` VARCHAR(25) NULL COMMENT '用户使用的操作系统版本号',
  `AGENT_STRING` VARCHAR(1024) NULL '浏览器传递过来的供应商字符串，浏览器和操作系统信息都是从这里分析出来的，有些不包含这些信息的，就将整个字符串记录下来',
  `ACCESS_TIME` DATETIME NULL COMMENT '访问时间',
  `LEAVE_TIME` DATETIME NULL COMMENT '离开时间',
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '用户访问日志';