package me.nhas.guesinggame;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.*;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import java.lang.Integer;


public class MainActivity extends AppCompatActivity {

    int number = (int) (Math.random() * 10 + 1);
    int level = 1;
    public void guess (View view) {
        TextView levelView = (TextView) findViewById(R.id.levelTextView);

        EditText guessText = (EditText) findViewById(R.id.guessEditText);


        Log.i("num", Integer.toString(number));

        int guessInt = Integer.parseInt(guessText.getText().toString());

        if (level == -5) {
            Toast.makeText(this, "ALAS YOU LOST!!", Toast.LENGTH_LONG).show();
            level = 1;

        }
        else if (level == 5) {
            Toast.makeText(this, "CONGRATS YOU WON!!", Toast.LENGTH_LONG).show();
            level = 1;
        }
        else if (guessInt == number ) {
            level = (int) level+1;
            Log.i("lvl", Integer.toString(level));
            levelView.setText(Integer.toString(level));
            Toast.makeText(this, "Matched", Toast.LENGTH_SHORT).show();
            number = (int) (Math.random() * 10 + 1);
            guessText.setText("");
        }
        else if (guessInt > number) {

            level = (int) level-1;
            Log.i("lvl", Integer.toString(level));
            levelView.setText(Integer.toString(level));


            guessText.setText("");
            Toast.makeText(this, "Try lower", Toast.LENGTH_SHORT).show();
        }
        else if (guessInt < number) {

            level = (int) level-1;
            Log.i("lvl", Integer.toString(level));
            levelView.setText(Integer.toString(level));


            guessText.setText("");

            Toast.makeText(this, "Try higher", Toast.LENGTH_SHORT).show();
        }
        else {
            Toast.makeText(this, "Not Matched", Toast.LENGTH_SHORT).show();
        }


    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
}
