package com.zizibujuan.drip.server.tests.servlets.json;

/*
 * "{\"date\":\"2013-01-01\", \"dateTime\":\"2013-01-01 10:10\", 
 * \"string\":\"你好hello\",\"int\":11,\"long\":1234567890123456789,
 * \"double\":10.1,\"boolean\":true,\"null\":null}";
 */
public class Bean {
	private String date;
	private String dateTime;
	private String string;
	private int int_;
	private long long_;
	private double double_;
	private boolean boolean_;
	private Object null_;
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getDateTime() {
		return dateTime;
	}
	public void setDateTime(String dateTime) {
		this.dateTime = dateTime;
	}
	public String getString() {
		return string;
	}
	public void setString(String string) {
		this.string = string;
	}
	public int getInt_() {
		return int_;
	}
	public void setInt_(int int_) {
		this.int_ = int_;
	}
	public long getLong_() {
		return long_;
	}
	public void setLong_(long long_) {
		this.long_ = long_;
	}
	public double getDouble_() {
		return double_;
	}
	public void setDouble_(double double_) {
		this.double_ = double_;
	}
	public boolean isBoolean_() {
		return boolean_;
	}
	public void setBoolean_(boolean boolean_) {
		this.boolean_ = boolean_;
	}
	public Object getNull_() {
		return null_;
	}
	public void setNull_(Object null_) {
		this.null_ = null_;
	}
}
