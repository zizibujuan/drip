package com.zizibujuan.drip.server.util.json;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.TypeAdapter;
import com.google.gson.TypeAdapterFactory;
import com.google.gson.internal.StringMap;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import com.google.gson.stream.JsonWriter;

public class GsonObjectTypeAdapter extends TypeAdapter<Object> {

	  public static final TypeAdapterFactory FACTORY = new TypeAdapterFactory() {
	    @SuppressWarnings("unchecked")
	    public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {
	      if (type.getRawType() == Object.class) {
	        return (TypeAdapter<T>) new GsonObjectTypeAdapter(gson);
	      }
	      return null;
	    }
	  };

	  private final Gson gson;

	  private GsonObjectTypeAdapter(Gson gson) {
	    this.gson = gson;
	  }

	  @Override public Object read(JsonReader in) throws IOException {
	    JsonToken token = in.peek();
	    switch (token) {
	    case BEGIN_ARRAY:
	      List<Object> list = new ArrayList<Object>();
	      in.beginArray();
	      while (in.hasNext()) {
	        list.add(read(in));
	      }
	      in.endArray();
	      return list;

	    case BEGIN_OBJECT:
	      Map<String, Object> map = new StringMap<Object>();
	      in.beginObject();
	      while (in.hasNext()) {
	        map.put(in.nextName(), read(in));
	      }
	      in.endObject();
	      return map;

	    case STRING:
	      return in.nextString();

	    case NUMBER:
	      return in.nextDouble();

	    case BOOLEAN:
	      return in.nextBoolean();

	    case NULL:
	      in.nextNull();
	      return null;

	    }
	    throw new IllegalStateException();
	  }

	  @SuppressWarnings("unchecked")
	  @Override public void write(JsonWriter out, Object value) throws IOException {
	    if (value == null) {
	      out.nullValue();
	      return;
	    }

	    TypeAdapter<Object> typeAdapter = (TypeAdapter<Object>) gson.getAdapter(value.getClass());
	    if (typeAdapter instanceof GsonObjectTypeAdapter) {
	      out.beginObject();
	      out.endObject();
	      return;
	    }

	    typeAdapter.write(out, value);
	  }
}
