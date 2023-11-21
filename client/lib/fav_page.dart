import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';

class FavouritesPage extends StatelessWidget {
  final List<WordPair> favs; // Change the type according to your needs

  FavouritesPage({required this.favs}); // Constructor to receive the prop

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Favourites'),
      ),
      body: Center(
        child: Container(
            color: Theme.of(context).colorScheme.primaryContainer,
            child: ListCard(favs: favs)),
      ),
    );
  }
}

class ListCard extends StatelessWidget {
  const ListCard({
    super.key,
    required this.favs,
  });

  final List<WordPair> favs;

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        Padding(
          padding: const EdgeInsets.all(20),
          child: Text('You have '
              '${favs.length} favorites:'),
        ),
        for (var pair in favs)
          ListTile(
            leading: Icon(Icons.favorite),
            title: Text(pair.asLowerCase),
          ),
      ],
    );
  }
}
