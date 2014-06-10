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
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.app.ListActivity;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.provider.ContactsContract;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.GridView;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;
import android.widget.Toast;
import android.widget.AdapterView.OnItemClickListener;

public class ProductListActivity extends Activity implements
		OnItemClickListener {

	private ProductAdapter productAdapter;
	private ArrayList<Product> arrayOfProduct;
	private ListView resulstListView;

	// private Long userRegistredKey;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_productlist);

		// Construct the data source
		arrayOfProduct = new ArrayList<Product>();
		// Create the adapter to convert the array to views
		productAdapter = new ProductAdapter(this, arrayOfProduct);
		// Attach the adapter to a ListView
		resulstListView = (ListView) findViewById(R.id.productList);
		resulstListView.setAdapter(productAdapter);
		// set the onclick listener
		resulstListView.setOnItemClickListener(this);
		// register listview for context menu
		registerForContextMenu(resulstListView);

		// start retrieving the list of checkins
		new ListOfProductsAsyncRetriever().execute();

	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.mainmenu, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		// action with ID action_refresh was selected
		case R.id.scan_btn:
			Intent myIntent = new Intent(getBaseContext(),
					QRReaderActivity.class);
			startActivity(myIntent);
			break;
		default:
			break;
		}
		return true;
	}

	@Override
	public void onItemClick(AdapterView<?> parent, View view, int position,
			long arg3) {
		Product productClicked = (Product) parent.getItemAtPosition(position);
		Intent myIntent = new Intent(this, ProductActivity.class);
		myIntent.putExtra("id", productClicked.getId());
		startActivity(myIntent);
	}

	public static List<Product> GET(String url) {
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
//				reslt = convertInputStreamToJSONObject(inputStream);
				result = convertInputStreamToProductList(inputStream);
			}
		} catch (Exception e) {
			Log.d("InputStream exception", e.getLocalizedMessage());
		}
		return result;
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

	private static List<Product> convertInputStreamToProductList(
			InputStream inputStream) {
		BufferedReader bufferedReader = new BufferedReader(
				new InputStreamReader(inputStream));
		String line = "";
		String result = "";
		List<Product> conversion = new ArrayList<Product>();

		try {
			while ((line = bufferedReader.readLine()) != null)
				result += line;
			inputStream.close();
			JSONObject obj = new JSONObject(result);
			Log.d("jsonobjs",obj.toString());
		} catch (IOException | JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return conversion;
	}

	private class ListOfProductsAsyncRetriever extends
			AsyncTask<Void, Void, List<Product>> {
		@Override
		protected List<Product> doInBackground(Void... urls) {

			return GET("http://10.0.2.2:3000/products");
		}

		// onPostExecute displays the results of the AsyncTask.
		@Override
		protected void onPostExecute(List<Product> result) {
			for (Product product : result) {
				productAdapter.add(product);
			}
			productAdapter.notifyDataSetChanged();
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
