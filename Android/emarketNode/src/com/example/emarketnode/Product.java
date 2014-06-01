package com.example.emarketnode;

public class Product {
	private double id;
	private String name;
	private float prize;

	public Product(double id, String name, float prize)
	{
	  this.id    = id;
	  this.name  = name;
	  this.prize = prize;
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

	public float getPrize() {
		return prize;
	}

	public void setPrize(float prize) {
		this.prize = prize;
	}
}
