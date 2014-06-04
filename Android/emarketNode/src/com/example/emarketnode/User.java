package com.example.emarketnode;

public class User {
	private double id;
	private String name;
	private String password;

	public User(double id, String name, String password)
	{
	  this.id    	= id;
	  this.name  	= name;
	  this.password = password;
	}

	public double getId() {
		return id;
	}

	public void setId(double id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
