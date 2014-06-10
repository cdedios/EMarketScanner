package com.example.emarketnode;

import org.json.JSONException;
import org.json.JSONObject;

public class Product {
	private int id;
	private String name, description;
	private float prize;

	public Product(int id, String name, String desc, float prize) {
		this.id = id;
		this.description = desc;
		this.name = name;
		this.prize = prize;
	}

	public Product(JSONObject json) {
		try {
			this.id = json.getInt("id");
			this.description = json.getString("desc");
			this.name = json.getString("name");
			this.prize = Float.parseFloat(json.getString("prize"));
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
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

	public void setId(int id) {
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
