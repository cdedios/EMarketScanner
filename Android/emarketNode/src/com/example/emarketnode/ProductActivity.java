package com.example.emarketnode;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONTokener;

import android.os.AsyncTask;
import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class ProductActivity extends Activity {

	// private EditText amount;
	private TextView title, prize, description;
	// private Basket userBasket;
	private Long productId;
	private Product product;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_product);

		if (savedInstanceState == null) {
			Bundle extras = getIntent().getExtras();
			if (extras == null) {
				productId = null;
			} else {
				productId = Long.parseLong((extras.getString("productId")));
			}
		} else {
			productId = (Long) savedInstanceState.getSerializable("productId");
		}

		title = (TextView) findViewById(R.id.textView1);
		prize = (TextView) findViewById(R.id.textView2);
		description = (TextView) findViewById(R.id.textView3);
		new GetProductsHttpAsyncTask().execute(productId.toString());	
	}

	private class GetProductsHttpAsyncTask extends
			AsyncTask<String, Void, JSONArray> {
		@Override
		protected JSONArray doInBackground(String... urls) {
			return getServer("http://10.0.2.2:3000/products/"+urls[0]);
		}

		// onPostExecute displays the results of the AsyncTask.
		@Override
		protected void onPostExecute(JSONArray result) {
			Toast.makeText(getBaseContext(), "Data Sent!", Toast.LENGTH_LONG)
					.show();
			Log.d("result", "Value: " + result.toString());
		}
	}

	public JSONArray getServer(String url) {
		InputStream content = null;
		JSONArray finalResult = null;
		try {
			HttpClient httpclient = new DefaultHttpClient();
			HttpResponse response = httpclient.execute(new HttpGet(url));
			content = response.getEntity().getContent();
			// 10. convert inputstream to string
			BufferedReader reader = new BufferedReader(new InputStreamReader(
					response.getEntity().getContent(), "UTF-8"));
			StringBuilder builder = new StringBuilder();
			for (String line = null; (line = reader.readLine()) != null;) {
				builder.append(line).append("\n");
			}
			JSONTokener tokener = new JSONTokener(builder.toString());
			finalResult = new JSONArray(tokener);
		} catch (Exception e) {
			// Log.("[GET REQUEST]", "Network exception", e);
		}
		return finalResult;
	}
}
