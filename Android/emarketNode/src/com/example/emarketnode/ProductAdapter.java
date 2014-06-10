package com.example.emarketnode;

import java.util.ArrayList;
import java.util.List;

import android.content.Context;
import android.content.ClipData.Item;
import android.database.Cursor;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.CursorAdapter;
import android.widget.ImageView;
import android.widget.TextView;

public class ProductAdapter extends ArrayAdapter<Product> {

	public ProductAdapter(Context context, List<Product> listObjects) {
		super(context, R.layout.listitem, listObjects);
		// TODO Auto-generated constructor stub
	}

	public View getView(int position, View convertView, ViewGroup parent) {
		// Get the data item for this position
		Product product = getItem(position);
		// Check if an existing view is being reused, otherwise inflate the view
		
		if (convertView == null) {
			convertView = LayoutInflater.from(getContext()).inflate(
					R.layout.listitem, null);
		}

		TextView lblName = (TextView) convertView
				.findViewById(R.id.nameProductTxtView);
		TextView lblDescription = (TextView) convertView
				.findViewById(R.id.descProdTxtView);
		TextView lblPrice = (TextView) convertView
				.findViewById(R.id.preuProdTxtView);
//		ImageView productImage = (ImageView) convertView
//				.findViewById(R.id.imageProductImagView);

		lblName.setText(product.getName());
		lblDescription.setText(product.getDescription());
		lblPrice.setText(String.valueOf(product.getPrize()));

		return (convertView);
	}
    



}
