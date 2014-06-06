package com.example.emarketnode;

public class Product {
	private double id;
	private String name, description;
	private float prize;

	public Product(double id, String name, String desc, float prize) {
		this.id = id;
		this.description = desc;
		this.name = name;
		this.prize = prize;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String desc) {
		this.description = desc;
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
