import 'package:flutter/material.dart';

void main() => runApp(MaterialApp(
        home: Scaffold(
      appBar: AppBar(
        title: Text(
          'First App',
        ),
        centerTitle: true,
        backgroundColor: Colors.pink[200],
      ),
      body: Center(
          child: Text(
        'Hello Everyone',
        style: TextStyle(fontSize: 20.0),
      )),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: Colors.purple[300],
        child: Text('click'),
      ),
    )));

// void main() {
//   runApp(MyApp());
// }

// class MyApp extends StatelessWidget {
//   const MyApp({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return ChangeNotifierProvider(
//       create: (context) => MyAppState(),
//       child: MaterialApp(
//         title: 'Namer App',
//         theme: ThemeData(
//           useMaterial3: true,
//           colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepOrange),
//         ),
//         home: MyHomePage(),
//       ),
//     );
//   }
// }

// class MyAppState extends ChangeNotifier {
//   var current = WordPair.random();
// }

// class MyHomePage extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     var appState = context.watch<MyAppState>();

//     return Scaffold(
//       body: Column(
//         children: [
//           Text('A random AWESOME idea:'),
//           Text(appState.current.asLowerCase),
//           ElevatedButton(
//               onPressed: () {
//                 print('button pressed');
//               },
//               child: Text('Next'))
//         ],
//       ),
//     );
//   }
// }
