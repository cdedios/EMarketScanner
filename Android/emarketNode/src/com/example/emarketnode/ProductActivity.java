package com.example.emarketnode;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
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
	private String productId;
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
				productId = extras.getString("productId");
			}
		} else {
			productId = savedInstanceState.getString("productId");
		}

		title = (TextView) findViewById(R.id.textView1);
		prize = (TextView) findViewById(R.id.textView2);
		description = (TextView) findViewById(R.id.textView3);

		new HttpAsyncTask().execute("http://10.0.2.2:3000/products/"
				+ productId.toString().trim());

	}

	public static JSONObject GET(String url) {
		InputStream inputStream = null;
		JSONObject reslt = null;
		List<Product> result = new ArrayList<Product>();
		try {

			// create HttpClient
			HttpClient httpclient = new DefaultHttpClient();

			// make GET request to the given URL
			HttpResponse httpResponse = httpclient.execute(new HttpGet(url));

			// receive response as inputStream
			inputStream = httpResponse.getEntity().getContent();

			// convert inputstream to string
			if (inputStream != null) {
				reslt = convertInputStreamToJSONObject(inputStream);
			}
		} catch (Exception e) {
			Log.d("InputStream", e.getLocalizedMessage());
		}
		return reslt;
	}

	private static String convertInputStreamToString(InputStream inputStream)
			throws IOException {
		BufferedReader bufferedReader = new BufferedReader(
				new InputStreamReader(inputStream));
		String line = "";
		String result = "";
		while ((line = bufferedReader.readLine()) != null)
			result += line;

		inputStream.close();
		return result;
	}

	private static JSONObject convertInputStreamToJSONObject(
			InputStream inputStream) throws JSONException, IOException {
		BufferedReader bufferedReader = new BufferedReader(
				new InputStreamReader(inputStream));
		String line = "";
		String result = "";
		while ((line = bufferedReader.readLine()) != null)
			result += line;

		inputStream.close();
		return new JSONObject(result);
	}

	private class HttpAsyncTask extends AsyncTask<String, Void, JSONObject> {
		@Override
		protected JSONObject doInBackground(String... urls) {
			return GET(urls[0]);
		}

		// onPostExecute displays the results of the AsyncTask.
		@Override
		protected void onPostExecute(JSONObject result) {
			Product p = new Product(result);
			description.setText(p.getDescription());
			title.setText(p.getName());
			prize.setText(String.valueOf(p.getPrize()));
		}
	}

	@Override
	protected void onPause() {
		super.onPause();
	}

	@Override
	protected void onResume() {
		super.onResume();
	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
	}
}
