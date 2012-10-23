ALTER TABLE `drip`.`DRIP_EXERCISE` 
	ADD constraint FK_EXERCISE_USER 
	FOREIGN KEY (CRT_USER_ID) 
	REFERENCES `drip`.`DRIP_USER_INFO` (`DBID` )

ALTER TABLE `drip`.`DRIP_ANSWER` 
	ADD constraint FK_ANSWER_USER 
	FOREIGN KEY (CRT_USER_ID) 
	REFERENCES `drip`.`DRIP_USER_INFO` (`DBID` )
	
ALTER TABLE `drip`.`DRIP_ANSWER` 
	ADD constraint FK_ANSWER_EXERCISE
	FOREIGN KEY (EXER_ID) 
	REFERENCES `drip`.`DRIP_EXERCISE` (`DBID` )
	
ALTER TABLE `drip`.`DRIP_CHOICE_OPTION` 
	ADD constraint FK_CHOICE_OPTION_EXERCISE
	FOREIGN KEY (EXER_ID) 
	REFERENCES `drip`.`DRIP_EXERCISE` (`DBID` )