import 'package:flutter/material.dart';

class UserStatsWidget extends StatelessWidget {
  final int visits;
  final int favorites;
  final int topShops;

  const UserStatsWidget({
    Key? key,
    required this.visits,
    required this.favorites,
    required this.topShops,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.blueAccent,
            Colors.blueAccent.shade700,
          ],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStatItem('Visitas', visits.toString()),
          _buildDivider(),
          _buildStatItem('Favoritos', favorites.toString()),
          _buildDivider(),
          _buildStatItem('Top Tiendas', topShops.toString()),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.white70,
          ),
        ),
      ],
    );
  }

  Widget _buildDivider() {
    return Container(
      height: 40,
      width: 1,
      color: Colors.white30,
    );
  }
}