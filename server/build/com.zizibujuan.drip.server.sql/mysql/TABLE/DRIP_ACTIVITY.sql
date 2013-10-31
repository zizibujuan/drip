-- 用户活动列表
-- 需满足以下需求：当将一个第三方帐号修改绑定后，
-- 之前绑定的主号将看不到使用第三方帐号登录时的活动；新绑定的主号可以看到之前的操作。
-- -----------------------------------------------------
-- Table `DRIP_ACTIVITY` 用户活动列表
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DRIP_ACTIVITY`;

CREATE  TABLE IF NOT EXISTS `DRIP_ACTIVITY` (
  `DBID` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键' ,
  `USER_ID` BIGINT NOT NULL COMMENT '本网站用户标识' ,
  `ACTION_TYPE` CHAR(4) NOT NULL COMMENT '活动类型，不同类型的活动内容存储在不同的表中',
  `IS_IN_HOME` TINYINT(1) DEFAULT 1 NULL COMMENT '是否在个人首页显示',
  `CONTENT_ID` BIGINT NULL COMMENT '活动输出的内容标识', -- 存储的是历史表中的标识，这样才能准确的对应上
  `CRT_TM` DATETIME NULL COMMENT '创建时间' ,
  PRIMARY KEY (`DBID`))
ENGINE = InnoDB
COMMENT = '用户活动列表';