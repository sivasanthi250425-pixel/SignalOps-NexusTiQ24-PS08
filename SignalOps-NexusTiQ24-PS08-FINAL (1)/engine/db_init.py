import sqlite3
import os
import sys

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'supply_chain.db')

def init_database():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Suppliers
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS suppliers (
        supplier_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        aliases TEXT,
        location TEXT,
        category TEXT,
        criticality TEXT CHECK(criticality IN ('High', 'Medium', 'Low'))
    );
    ''')

    # 2. Materials / SKUs
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS materials (
        sku_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        unit_cost_usd REAL NOT NULL
    );
    ''')

    # 3. Inventory
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS inventory (
        inventory_id TEXT PRIMARY KEY,
        sku_id TEXT NOT NULL,
        warehouse_id TEXT NOT NULL,
        warehouse_name TEXT NOT NULL,
        on_hand_qty INTEGER NOT NULL,
        safety_stock_threshold INTEGER NOT NULL,
        allocated_qty INTEGER NOT NULL,
        FOREIGN KEY (sku_id) REFERENCES materials(sku_id)
    );
    ''')

    # 4. Shipments
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS shipments (
        shipment_id TEXT PRIMARY KEY,
        supplier_id TEXT NOT NULL,
        sku_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        carrier TEXT NOT NULL,
        vessel_or_flight TEXT,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        scheduled_eta TEXT NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
        FOREIGN KEY (sku_id) REFERENCES materials(sku_id)
    );
    ''')

    # 5. Customer Orders
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS customer_orders (
        order_id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        tier TEXT NOT NULL,
        sku_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        promise_date TEXT NOT NULL,
        sla_penalty_per_day_usd REAL NOT NULL,
        FOREIGN KEY (sku_id) REFERENCES materials(sku_id)
    );
    ''')

    # 6. Logistics Contracts (available real mitigation options)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS logistics_contracts (
        contract_id TEXT PRIMARY KEY,
        carrier_name TEXT NOT NULL,
        service_name TEXT NOT NULL,
        action_type TEXT NOT NULL,
        base_cost_usd REAL NOT NULL,
        cost_per_unit_usd REAL NOT NULL,
        transit_days INTEGER NOT NULL,
        max_capacity INTEGER NOT NULL,
        applies_to_sku TEXT,
        description TEXT NOT NULL
    );
    ''')

    # Clear existing data for a clean, deterministic seed
    cursor.execute('DELETE FROM logistics_contracts;')
    cursor.execute('DELETE FROM customer_orders;')
    cursor.execute('DELETE FROM shipments;')
    cursor.execute('DELETE FROM inventory;')
    cursor.execute('DELETE FROM materials;')
    cursor.execute('DELETE FROM suppliers;')

    # Seed Suppliers
    suppliers = [
        ('SUP-01', 'ABC Components', 'ABC, ABC Comp, Kaohsiung Plant', 'Kaohsiung, TW', 'Semiconductors & MCUs', 'High'),
        ('SUP-02', 'Apex Foundry & Metals', 'Apex Foundry, Dresden Facility', 'Dresden, DE', 'Precision Titanium Alloys', 'High'),
        ('SUP-03', 'EuroParts GmbH', 'EuroParts, Frankfurt Hub', 'Stuttgart, DE', 'Optical Telemetry Nodes', 'Medium'),
        ('SUP-04', 'Pacific Cable Works', 'Pacific Cable', 'Yokohama, JP', 'Mil-Spec Wire Harnesses', 'Low'),
        ('SUP-05', 'Northern Logistics Materials', 'Northern Logistics, Rotterdam Terminal', 'Rotterdam, NL', 'Corrugated Packaging & Pallets', 'Low')
    ]
    cursor.executemany('INSERT INTO suppliers VALUES (?, ?, ?, ?, ?, ?)', suppliers)

    # Seed Materials
    materials = [
        ('SKU-X', 'MCU-8400 Microcontroller Core', 'Semiconductors', 340.00),
        ('SKU-Y', 'Ti-6Al-4V Titanium Forged Ingot', 'Metals & Alloys', 185.00),
        ('SKU-Z', 'Sensor Node Opto-440', 'Optics & Telemetry', 520.00),
        ('SKU-PKG', 'Heavy-Duty Reinforced Dunnage Pallet', 'Packaging', 14.00)
    ]
    cursor.executemany('INSERT INTO materials VALUES (?, ?, ?, ?)', materials)

    # Seed Inventory
    inventory = [
        ('INV-01', 'SKU-X', 'DC-CENTRAL', 'Central DC (Dallas, TX)', 80, 100, 80),
        ('INV-02', 'SKU-Y', 'DC-EAST', 'East DC (Newark, NJ)', 120, 150, 120),
        ('INV-03', 'SKU-Z', 'DC-MIDWEST', 'Midwest DC (Chicago, IL)', 45, 50, 45),
        ('INV-04', 'SKU-PKG', 'DEPOT-ROTTERDAM', 'Rotterdam Logistics Depot', 2400, 300, 120)
    ]
    cursor.executemany('INSERT INTO inventory VALUES (?, ?, ?, ?, ?, ?, ?)', inventory)

    # Seed Shipments
    shipments = [
        ('SH-102', 'SUP-01', 'SKU-X', 200, 'OceanEver Line', 'Vessel EverForward', 'Port of Kaohsiung', 'Port of Long Beach / Central DC', '2026-09-08', 'In Transit'),
        ('SH-108', 'SUP-02', 'SKU-Y', 500, 'Maersk Line', 'Maersk Mc-Kinney', 'Port of Hamburg', 'Newark Port / East DC', '2026-09-12', 'In Transit'),
        ('SH-114', 'SUP-03', 'SKU-Z', 150, 'DHL Global Forwarding', 'Flight DHK412', 'Frankfurt Hub', 'Chicago Midwest DC', '2026-09-10', 'In Transit')
    ]
    cursor.executemany('INSERT INTO shipments VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', shipments)

    # Seed Customer Orders (Exact explicit SLA penalties and promise dates)
    customer_orders = [
        ('ORD-104', 'CUST-01', 'Customer Orion Industrial', 'Tier-1 Strategic', 'SKU-X', 120, '2026-09-07', 1200.00),
        ('ORD-108', 'CUST-02', 'Apex Defense Dynamics', 'Tier-1 Defense', 'SKU-X', 70, '2026-09-09', 2500.00),
        ('ORD-112', 'CUST-03', 'Nordic Heavy Machining', 'Tier-2 Industrial', 'SKU-X', 50, '2026-09-14', 600.00),
        ('ORD-119', 'CUST-04', 'Solaria Energy Grid', 'Tier-2 Commercial', 'SKU-X', 40, '2026-09-16', 450.00),
        ('ORD-122', 'CUST-05', 'Helios Robotics Corp', 'Tier-3 Standard', 'SKU-X', 60, '2026-09-18', 800.00),
        ('ORD-127', 'CUST-06', 'Vanguard Systems', 'Tier-3 Standard', 'SKU-X', 80, '2026-09-20', 500.00),

        # Orders for SKU-Y
        ('ORD-201', 'CUST-07', 'Krupp Aero Structures', 'Tier-1 Industrial', 'SKU-Y', 100, '2026-09-15', 1800.00),
        ('ORD-205', 'CUST-08', 'Bavaria Turbine Tech', 'Tier-2 Industrial', 'SKU-Y', 80, '2026-09-22', 950.00),

        # Orders for SKU-Z
        ('ORD-302', 'CUST-09', 'Aether Sensor Works', 'Tier-1 Defense', 'SKU-Z', 40, '2026-09-11', 1500.00)
    ]
    cursor.executemany('INSERT INTO customer_orders VALUES (?, ?, ?, ?, ?, ?, ?, ?)', customer_orders)

    # Seed Logistics Contracts (Explicit mitigation capabilities)
    contracts = [
        ('CTR-EXP-01', 'Pacific Cargo Charters', 'Direct Trans-Pacific Air Charter', 'EXPEDITE', 12000.00, 70.00, 3, 100, 'SKU-X', 'Pre-negotiated emergency air charter from secondary hub to Central DC (Dallas, TX).'),
        ('CTR-REALLOC-02', 'Inter-DC Freight', 'Inter-DC Ground Transfer', 'REALLOCATE', 4500.00, 25.00, 2, 40, 'SKU-X', 'Inter-warehouse freight transfer of reserve buffer stock from East DC (Newark, NJ) to Central DC (Dallas, TX).'),
        ('CTR-PARTSHIP-03', 'Standard Express Logistics', 'Split Partial Delivery', 'PART-SHIP', 1800.00, 12.00, 1, 80, 'SKU-X', 'Immediate partial dispatch of 80 on-hand units to Customer Orion Industrial to maintain baseline production.'),
        
        ('CTR-EXP-02', 'Lufthansa Cargo Priority', 'Trans-Atlantic Priority Airfreight', 'EXPEDITE', 15000.00, 45.00, 2, 200, 'SKU-Y', 'Expedited airfreight from Frankfurt to Newark East DC to bridge foundry downtime.')
    ]
    cursor.executemany('INSERT INTO logistics_contracts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', contracts)

    conn.commit()
    conn.close()
    print(f"Database successfully initialized at {DB_PATH}")

if __name__ == '__main__':
    init_database()
