package com.example.demo.Service;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class SupabaseService {

    private static final String SUPABASE_BUCKET = "uploads";
    private static final String SUPABASE_PROJECT_ID = "https://umizvvtljajrvrbzdpzi.supabase.co"; // e.g., https://umizvvtljajrvrbzdpzi.supabase.coabcdefghijklmno
    private static final String API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtaXp2dnRsamFqcnZyYnpkcHppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTAxNjI3OSwiZXhwIjoyMDY0NTkyMjc5fQ.16B7k1iM64z2_npyfKT3ryC0jjaDfNDgvbFa_qpDwMw";

    // The correct base API URL
    private static final String SUPABASE_API_URL = "https://" + SUPABASE_PROJECT_ID + ".supabase.co/storage/v1/object";

    public String uploadPdf(String fileName, byte[] fileBytes) throws IOException {
        String objectPath = SUPABASE_BUCKET + "/" + fileName;
        String urlStr = SUPABASE_API_URL + "/" + objectPath;

        URL url = new URL(urlStr);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST"); // or "PUT" if object already exists
        connection.setRequestProperty("apikey", API_KEY);
        connection.setRequestProperty("Authorization", "Bearer " + API_KEY);
        connection.setRequestProperty("Content-Type", "application/pdf");
        connection.setDoOutput(true);

        try (OutputStream os = connection.getOutputStream()) {
            os.write(fileBytes);
            os.flush();
        }

        int responseCode = connection.getResponseCode();
        if (responseCode == 200 || responseCode == 201) {
            return "https://" + SUPABASE_PROJECT_ID + ".supabase.co/storage/v1/object/public/" + objectPath;
        } else {
            throw new IOException("Upload failed. Response Code: " + responseCode + ", Message: " + connection.getResponseMessage());
        }
    }
}

