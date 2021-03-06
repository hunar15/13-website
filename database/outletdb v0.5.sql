-- phpMyAdmin SQL Dump
-- version 3.2.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 13, 2012 at 05:12 PM
-- Server version: 5.1.44
-- PHP Version: 5.3.1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `outletdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `batch_request`
--

CREATE TABLE IF NOT EXISTS `batch_request` (
  `date` date NOT NULL,
  `status` varchar(15) NOT NULL,
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `batch_request`
--

INSERT INTO `batch_request` (`date`, `status`) VALUES
('2012-11-13', 'COMPLETED');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE IF NOT EXISTS `inventory` (
  `barcode` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `selling_price` float NOT NULL,
  `min_stock` int(11) NOT NULL,
  PRIMARY KEY (`barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`barcode`, `stock`, `selling_price`, `min_stock`) VALUES
(1111, 2000, 227.73, 40),
(11521340, 2000, 21.8, 2415),
(11760294, 2000, 82.4, 3065),
(12008016, 2000, 32.05, 100),
(13523279, 2000, 85.5, 100),
(15521955, 2000, 95.45, 1180),
(16543556, 2000, 3.45, 3840),
(16686549, 2000, 97.25, 3845),
(16948044, 2000, 34.25, 100),
(18121244, 2000, 41.5, 2925),
(18164847, 2000, 79.3, 160),
(18175970, 2000, 85.05, 100),
(18243337, 2000, 60.05, 2035),
(19619262, 2000, 86.65, 890),
(20151308, 2000, 20.65, 380),
(20219909, 2000, 42.5, 3660),
(20909394, 2000, 27.95, 1690),
(21884433, 2000, 22.85, 100),
(22016225, 2000, 55.8, 4230),
(23946308, 2000, 94, 1785),
(24067314, 2000, 90.85, 1885),
(24768324, 2000, 10.4, 100),
(26264360, 2000, 45.7, 2370),
(26653184, 2000, 29.2, 100),
(27693372, 2000, 65.4, 4755),
(28127291, 2000, 86.4, 1565),
(28323264, 2000, 44.9, 3510),
(28366167, 2000, 98.05, 100),
(30011470, 2000, 31.55, 100),
(30300675, 2000, 51.5, 4400),
(30364600, 2000, 70.15, 1275),
(31129261, 2000, 71.65, 100),
(31555897, 2000, 61, 100),
(32592458, 2000, 97.35, 4435),
(32703379, 2000, 53.15, 100),
(33188933, 2000, 40.85, 100),
(33464262, 2000, 85.25, 100),
(33491310, 2000, 37.85, 100),
(34571368, 2000, 78.3, 2690),
(34994031, 2000, 51.4, 100),
(35412528, 2000, 56.65, 100),
(35653240, 2000, 68.4, 100),
(35760875, 2000, 14.45, 100),
(36002736, 2000, 24.05, 100),
(36092718, 2000, 56.6, 2815),
(36795157, 2000, 80.6, 1675),
(37676915, 2000, 78.95, 2135),
(38004786, 2000, 90.15, 3010),
(40098529, 2000, 83.45, 990),
(40155785, 2000, 41.8, 1290),
(40443390, 2000, 33.85, 100),
(40924160, 2000, 45.6, 100),
(41660339, 2000, 30.2, 100),
(43741253, 2000, 30, 4405),
(46547386, 2000, 82.65, 4370),
(47974430, 2000, 35.4, 4045),
(50148962, 2000, 46.35, 895),
(51312536, 2000, 40.35, 1350),
(51336619, 2000, 36.05, 1895),
(51808477, 2000, 47.1, 1710),
(52240015, 2000, 1.25, 680),
(54053173, 2000, 37.9, 100),
(54528680, 2000, 83.5, 2465),
(55659812, 2000, 46.3, 100),
(56208845, 2000, 96.3, 100),
(59030623, 2000, 26.85, 2625),
(61187597, 2000, 9.95, 3155),
(63502056, 2000, 74.8, 100),
(64677697, 2000, 4.75, 100),
(65201080, 2000, 92.5, 1250),
(65871735, 2000, 71.25, 760),
(66752080, 2000, 93.8, 1215),
(66765410, 2000, 18.4, 220),
(67531375, 2000, 21.15, 100),
(67775131, 2000, 82.9, 100),
(67859788, 2000, 14.45, 2800),
(68508930, 2000, 65.3, 100),
(69693583, 2000, 57.6, 3205),
(70525778, 2000, 87.45, 100),
(75506105, 2000, 66.65, 100),
(76409993, 2000, 96.15, 1010),
(77464010, 2000, 86.25, 780),
(78107011, 2000, 52.25, 100),
(79951082, 2000, 7.55, 100),
(80796672, 2000, 80.6, 100),
(81856054, 2000, 19.7, 815),
(81889450, 2000, 64.85, 100),
(82129140, 2000, 36.75, 100),
(83024065, 2000, 63.2, 295),
(83829674, 2000, 71.25, 4020),
(83920592, 2000, 65.7, 100),
(86377180, 2000, 18.15, 2670),
(86747844, 2000, 38.3, 2645),
(88491799, 2000, 94.35, 655),
(88723081, 2000, 4.15, 100),
(90114604, 2000, 2.75, 100),
(90359597, 2000, 85.45, 100),
(90713781, 2000, 90.65, 3850),
(91000270, 2000, 66.45, 2140),
(93404773, 2000, 6.2, 100),
(93719528, 2000, 23.05, 830);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE IF NOT EXISTS `product` (
  `barcode` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `cost_price` float NOT NULL,
  `category` varchar(150) NOT NULL,
  `manufacturer` varchar(150) NOT NULL,
  `status` varchar(15) NOT NULL,
  PRIMARY KEY (`barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`barcode`, `name`, `cost_price`, `category`, `manufacturer`, `status`) VALUES
(1111, 'abc', 12, 'abc', 'aaa', 'NORMAL'),
(11521340, 'Money Clip', 21.8, 'Breakfast Foods', '3315', 'NORMAL'),
(11760294, '4 ink colour ball pen', 82.4, 'Tobacco Papers', '4715', 'NORMAL'),
(12008016, 'Duffle cooler bag', 32.05, 'Toys & Games', '1975', 'NORMAL'),
(13523279, 'Silver Round Zipper Tin', 85.5, 'Gourmet Food', '2905', 'NORMAL'),
(15521955, 'ASSORTED COLOUR JELLY BEANS IN SCREW CAP JAR', 95.45, 'Automotive', '3680', 'NORMAL'),
(16543556, 'ANTI STRESS SOCCER BALL', 3.45, 'Bakery', '4740', 'NORMAL'),
(16686549, 'Non-woven shopper bag', 97.25, 'Tools, Auto & Industrial', '4545', 'NORMAL'),
(16948044, 'Tape measure w/ carabiner hook.', 34.25, 'Athletic & Outdoor Clothing', '590', 'NORMAL'),
(18121244, 'Bath Salts Bottle', 41.5, 'Video On Demand', '4775', 'NORMAL'),
(18164847, 'Standard 12 inch (30cm) Balloons', 79.3, 'Video Games', '2560', 'NORMAL'),
(18175970, 'Rectangular Keyring', 85.05, 'MP3 Downloads', '1380', 'NORMAL'),
(18243337, 'Highlighter pen with memo pad', 60.05, 'Grocery, Health & Beauty', '5385', 'NORMAL'),
(19619262, 'Sports Towel', 86.65, 'Hair Removal', '4340', 'NORMAL'),
(20151308, 'Cotton Hatbands', 20.65, 'Cell Phones & Service', '1980', 'NORMAL'),
(20219909, 'Techno Flash Drive 256MB', 42.5, 'Bottle', '4410', 'NORMAL'),
(20909394, 'Ladies Aston Short Sleeve', 27.95, 'Printers & Ink', '4540', 'NORMAL'),
(21884433, 'A4 Portfolio', 22.85, 'Video Games for Kids', '1050', 'NORMAL'),
(22016225, 'Wired Backpack', 55.8, 'Home & Garden', '4930', 'NORMAL'),
(23946308, 'Trend Wine Cooler', 94, 'Industrial & Scientific', '2035', 'NORMAL'),
(24067314, 'Travel Clock', 90.85, 'MP3 & Media Players', '5085', 'NORMAL'),
(24768324, 'CONTOUR BALLPOINT PEN ', 10.4, 'Outdoor Power Equipment', '1695', 'NORMAL'),
(26264360, 'White paper shopping bag ', 45.7, 'Team Sports', '4520', 'NORMAL'),
(26653184, 'Whistle Keyring', 29.2, 'Accessories', '1865', 'NORMAL'),
(27693372, 'Blue ink ball pen ', 65.4, 'Nursery', '5155', 'NORMAL'),
(28127291, 'Acrylic Beanie ', 86.4, 'Guinness', '2515', 'NORMAL'),
(28323264, 'New Orleans Mug', 44.9, 'Kindle DX', '5360', 'NORMAL'),
(28366167, 'Urban Sticky Note Holder', 98.05, 'Training Pants', '815', 'NORMAL'),
(30011470, 'Goggles', 31.55, 'Outdoor Recreation', '1300', 'NORMAL'),
(30300675, 'Mesh Sports Cap', 51.5, 'Shower & Bath Products', '5300', 'NORMAL'),
(30364600, '5 Panel Trucker Mesh Cap', 70.15, 'Drinks', '2275', 'NORMAL'),
(31129261, 'Mulberry', 71.65, 'Jewelry', '1295', 'NORMAL'),
(31555897, 'Pillow Pack', 61, 'Kindle Store', '820', 'NORMAL'),
(32592458, 'A5 Eco Notepad', 97.35, 'Liquor', '5335', 'NORMAL'),
(32703379, 'Hourglass with blue sand', 53.15, 'Home Care', '3665', 'NORMAL'),
(33188933, 'White Lip Balm Pot', 40.85, 'Seasonal', '1215', 'NORMAL'),
(33464262, 'Koeskin Zip Round Portfolio', 85.25, 'Travel Wipes', '3300', 'NORMAL'),
(33491310, 'Two tone jute shopping bag', 37.85, 'Bath Products', '575', 'NORMAL'),
(34571368, 'CLASSIC PAPER STRING STRAW HAT ', 78.3, 'Golf', '4640', 'NORMAL'),
(34994031, 'Dill', 51.4, 'Toys, Kids & Baby', '1390', 'NORMAL'),
(35412528, 'Fennel, Sweet', 56.65, 'Boardgames', '4350', 'NORMAL'),
(35653240, 'Symphony Gold Top Pen', 68.4, 'Shampoo', '2310', 'NORMAL'),
(35760875, 'Ball pen with rubber grip', 14.45, 'Fan Shop', '2610', 'NORMAL'),
(36002736, 'A5 Leather Compendium', 24.05, 'Health & Safety', '4310', 'NORMAL'),
(36092718, 'Silver Round Zipper Tin', 56.6, 'Condiments & Dressings', '4015', 'NORMAL'),
(36795157, 'Metal ball pen', 80.6, 'Nursery', '3225', 'NORMAL'),
(37676915, 'ROUND METAL CASE FLASHLIGHT KEYTAG ', 78.95, 'Home & Garden', '4835', 'NORMAL'),
(38004786, 'Java Mini Mug', 90.15, 'Grocery, Health & Beauty', '5410', 'NORMAL'),
(40098529, 'Mens Short Sleeve Metro Shirt ', 83.45, 'Industrial & Scientific', '4490', 'NORMAL'),
(40155785, 'Vision Memo Set', 41.8, 'Desktops & Servers', '1990', 'NORMAL'),
(40443390, 'BALL POINT PEN', 33.85, 'Rice Pasta & Grains', '3425', 'NORMAL'),
(40924160, 'Pen and pencil set', 45.6, 'Oil', '1525', 'NORMAL'),
(41660339, 'MEGA KLAPPER', 30.2, 'Jewelry', '2430', 'NORMAL'),
(43741253, 'Aircraft Keyring', 30, 'Accessories', '5155', 'NORMAL'),
(46547386, 'Piggy bank', 82.65, 'Toys & Games', '4920', 'NORMAL'),
(47974430, 'HITME Ball pen with light bulb', 35.4, 'Food', '4895', 'NORMAL'),
(50148962, 'Mini Cyber Brushes', 46.35, 'All Sports & Outdoors', '1495', 'NORMAL'),
(51312536, 'Emergency raincoat hermetic bag', 40.35, 'Toys, Kids & Baby', '5200', 'NORMAL'),
(51336619, 'A4 Leather Binder Retractable', 36.05, 'Grocery, Health & Beauty', '3195', 'NORMAL'),
(51808477, 'Corniche 4 pcs shoulder picnic pack', 47.1, 'Blu-ray', '2810', 'NORMAL'),
(52240015, '20 pcs Small first aid kit', 1.25, 'Blu-ray', '4930', 'NORMAL'),
(54053173, 'Aquatic ball set', 37.9, 'Home Appliances', '655', 'NORMAL'),
(54528680, 'SIM Card Data Saver - with Phone Book', 83.5, 'Magazines', '4065', 'NORMAL'),
(55659812, 'SOLIS - Y224 Engraved', 46.3, 'Motorcycle & ATV', '1740', 'NORMAL'),
(56208845, 'Poly Cotton Bucket Hat', 96.3, 'Health & Personal Care', '1220', 'NORMAL'),
(59030623, 'BHC Golf Visor With Magnetic Marker', 26.85, 'Stop Smoking', '3325', 'NORMAL'),
(61187597, 'Business Card Holder', 9.95, 'Musical Instruments', '3605', 'NORMAL'),
(63502056, '12 colour pencil in tin box ', 74.8, 'Musical Instruments', '965', 'NORMAL'),
(64677697, 'Concord', 4.75, 'Team Sports', '865', 'NORMAL'),
(65201080, 'Map of Australia Keyring', 92.5, 'Furniture & DÈcor', '2200', 'NORMAL'),
(65871735, 'Papaya', 71.25, 'Seasonal', '4460', 'NORMAL'),
(66752080, 'Rock Rose', 93.8, 'Ready To Drink', '3315', 'NORMAL'),
(66765410, 'WHITE MICROFIBRE LENS CLOTH', 18.4, 'Grocery, Health & Beauty', '920', 'NORMAL'),
(67531375, 'Flash Sports Bag', 21.15, 'Jewelry', '890', 'NORMAL'),
(67775131, 'LIGHT BULB PAPERCLIPS ON MAGNETIC BASE', 82.9, 'Bath Products', '3705', 'NORMAL'),
(67859788, 'Wooden Mirror', 14.45, 'Natural & Organic', '5350', 'NORMAL'),
(68508930, 'Outdoors Kit', 65.3, 'Video Games', '1460', 'NORMAL'),
(69693583, 'First Aid kit in EVA', 57.6, 'MP3 Downloads', '3355', 'NORMAL'),
(70525778, 'Tentacle USB Hub', 87.45, 'Grocery', '1820', 'NORMAL'),
(75506105, 'Corporate Colour Mini Jelly Beans In 6cm Canister  ', 66.65, 'Incontinence Supplies', '2580', 'NORMAL'),
(76409993, 'Optically Secure', 96.15, 'Musical Instruments', '1910', 'NORMAL'),
(77464010, 'Metal twist ball pen', 86.25, 'Wipes Refills', '3330', 'NORMAL'),
(78107011, 'BIG WAVE TRANSPARENT KEYTAG', 52.25, 'Clothing & Accessories', '560', 'NORMAL'),
(79951082, 'Anti-stress football', 7.55, 'Skin Care', '4295', 'NORMAL'),
(80796672, 'Clip it', 80.6, 'Books, newspapers & more', '1835', 'NORMAL'),
(81856054, 'ERGO EXTRA', 19.7, 'Accessories', '1965', 'NORMAL'),
(81889450, 'Cinnamon, Cassia', 64.85, 'Health & Personal Care', '1660', 'NORMAL'),
(82129140, 'Transparent solar calculator', 36.75, 'Personal Care', '2840', 'NORMAL'),
(83024065, 'Larkspur', 63.2, 'MP3 Downloads', '1595', 'NORMAL'),
(83829674, 'Non woven Kit Bag', 71.25, 'Digital Downloads', '4470', 'NORMAL'),
(83920592, 'Wine opener', 65.7, 'Shoes', '2540', 'NORMAL'),
(86377180, 'SIM CARD BACKUP', 18.15, 'Body Care', '4020', 'NORMAL'),
(86747844, 'Torch Tape Measure', 38.3, 'Incontinence Supplies', '3895', 'NORMAL'),
(88491799, 'fluro whistle', 94.35, 'Toiletries', '1205', 'NORMAL'),
(88723081, 'Vibe Pen', 4.15, 'Video Games', '2925', 'NORMAL'),
(90114604, 'Stevia', 2.75, 'Musical Instruments', '2905', 'NORMAL'),
(90359597, 'Double Wine Bottle Carrier', 85.45, 'Fan Shop', '850', 'NORMAL'),
(90713781, 'Fabio VOIP Earphone and Microphone', 90.65, 'Video On Demand', '4400', 'NORMAL'),
(91000270, 'Classic mechanical pencil', 66.45, 'Vacuums & Storage', '2290', 'NORMAL'),
(93404773, 'Ultra Vista Ballpoint pen', 6.2, 'Athletic & Outdoor Clothing', '2050', 'NORMAL'),
(93719528, 'Lemon Grass', 23.05, 'Health & Personal Care', '3130', 'NORMAL');

-- --------------------------------------------------------

--
-- Table structure for table `request_details`
--

CREATE TABLE IF NOT EXISTS `request_details` (
  `date` date NOT NULL,
  `barcode` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`date`,`barcode`),
  KEY `barcode` (`barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `request_details`
--

INSERT INTO `request_details` (`date`, `barcode`, `quantity`) VALUES
('2012-11-13', 1111, 60),
('2012-11-13', 11521340, 3623),
('2012-11-13', 11760294, 4598),
('2012-11-13', 12008016, 150),
('2012-11-13', 13523279, 150),
('2012-11-13', 15521955, 1770),
('2012-11-13', 16543556, 5760),
('2012-11-13', 16686549, 5768),
('2012-11-13', 16948044, 150),
('2012-11-13', 18121244, 4388),
('2012-11-13', 18164847, 240),
('2012-11-13', 18175970, 150),
('2012-11-13', 18243337, 3053),
('2012-11-13', 19619262, 1335),
('2012-11-13', 20151308, 570),
('2012-11-13', 20219909, 5490),
('2012-11-13', 20909394, 2535),
('2012-11-13', 21884433, 150),
('2012-11-13', 22016225, 6345),
('2012-11-13', 23946308, 2678),
('2012-11-13', 24067314, 2828),
('2012-11-13', 24768324, 150),
('2012-11-13', 26264360, 3555),
('2012-11-13', 26653184, 150),
('2012-11-13', 27693372, 7133),
('2012-11-13', 28127291, 2348),
('2012-11-13', 28323264, 5265),
('2012-11-13', 28366167, 150),
('2012-11-13', 30011470, 150),
('2012-11-13', 30300675, 6600),
('2012-11-13', 30364600, 1913),
('2012-11-13', 31129261, 150),
('2012-11-13', 31555897, 150),
('2012-11-13', 32592458, 6653),
('2012-11-13', 32703379, 150),
('2012-11-13', 33188933, 150),
('2012-11-13', 33464262, 150),
('2012-11-13', 33491310, 150),
('2012-11-13', 34571368, 4035),
('2012-11-13', 34994031, 150),
('2012-11-13', 35412528, 150),
('2012-11-13', 35653240, 150),
('2012-11-13', 35760875, 150),
('2012-11-13', 36002736, 150),
('2012-11-13', 36092718, 4223),
('2012-11-13', 36795157, 2513),
('2012-11-13', 37676915, 3203),
('2012-11-13', 38004786, 4515),
('2012-11-13', 40098529, 1485),
('2012-11-13', 40155785, 1935),
('2012-11-13', 40443390, 150),
('2012-11-13', 40924160, 150),
('2012-11-13', 41660339, 150),
('2012-11-13', 43741253, 6608),
('2012-11-13', 46547386, 6555),
('2012-11-13', 47974430, 6068),
('2012-11-13', 50148962, 1343),
('2012-11-13', 51312536, 2025),
('2012-11-13', 51336619, 2843),
('2012-11-13', 51808477, 2565),
('2012-11-13', 52240015, 1020),
('2012-11-13', 54053173, 150),
('2012-11-13', 54528680, 3698),
('2012-11-13', 55659812, 150),
('2012-11-13', 56208845, 150),
('2012-11-13', 59030623, 3938),
('2012-11-13', 61187597, 4733),
('2012-11-13', 63502056, 150),
('2012-11-13', 64677697, 150),
('2012-11-13', 65201080, 1875),
('2012-11-13', 65871735, 1140),
('2012-11-13', 66752080, 1823),
('2012-11-13', 66765410, 330),
('2012-11-13', 67531375, 150),
('2012-11-13', 67775131, 150),
('2012-11-13', 67859788, 4200),
('2012-11-13', 68508930, 150),
('2012-11-13', 69693583, 4808),
('2012-11-13', 70525778, 150),
('2012-11-13', 75506105, 150),
('2012-11-13', 76409993, 1515),
('2012-11-13', 77464010, 1170),
('2012-11-13', 78107011, 150),
('2012-11-13', 79951082, 150),
('2012-11-13', 80796672, 150),
('2012-11-13', 81856054, 1223),
('2012-11-13', 81889450, 150),
('2012-11-13', 82129140, 150),
('2012-11-13', 83024065, 443),
('2012-11-13', 83829674, 6030),
('2012-11-13', 83920592, 150),
('2012-11-13', 86377180, 4005),
('2012-11-13', 86747844, 3968),
('2012-11-13', 88491799, 983),
('2012-11-13', 88723081, 150),
('2012-11-13', 90114604, 150),
('2012-11-13', 90359597, 150),
('2012-11-13', 90713781, 5775),
('2012-11-13', 91000270, 3210),
('2012-11-13', 93404773, 150),
('2012-11-13', 93719528, 1245);

-- --------------------------------------------------------

--
-- Table structure for table `sold_yesterday`
--

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `outletdb`.`sold_yesterday` AS select `d`.`barcode` AS `barcode`,`t`.`date` AS `date`,`d`.`price` AS `price`,sum(`d`.`quantity`) AS `total` from (`outletdb`.`transaction_details` `d` join `outletdb`.`transaction` `t` on((`t`.`id` = `d`.`id`))) where (`t`.`date` = (curdate() - interval 1 day)) group by `t`.`date`,`d`.`barcode`,`d`.`price`;

--
-- Dumping data for table `sold_yesterday`
--

INSERT INTO `sold_yesterday` (`barcode`, `date`, `price`, `total`) VALUES
(1111, '2012-11-13', 11, 12);

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE IF NOT EXISTS `transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cashier_id` int(11) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`id`, `cashier_id`, `date`) VALUES
(1, 1, '2012-11-13'),
(2, 1, '2012-11-12');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_details`
--

CREATE TABLE IF NOT EXISTS `transaction_details` (
  `id` int(11) NOT NULL,
  `barcode` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` float NOT NULL,
  PRIMARY KEY (`id`,`barcode`),
  KEY `barcode` (`barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transaction_details`
--

INSERT INTO `transaction_details` (`id`, `barcode`, `quantity`, `price`) VALUES
(1, 1111, 12, 11),
(2, 1111, 112, 1111);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`barcode`) REFERENCES `product` (`barcode`);

--
-- Constraints for table `request_details`
--
ALTER TABLE `request_details`
  ADD CONSTRAINT `request_details_ibfk_1` FOREIGN KEY (`date`) REFERENCES `batch_request` (`date`),
  ADD CONSTRAINT `request_details_ibfk_2` FOREIGN KEY (`barcode`) REFERENCES `product` (`barcode`);

--
-- Constraints for table `transaction_details`
--
ALTER TABLE `transaction_details`
  ADD CONSTRAINT `transaction_details_ibfk_1` FOREIGN KEY (`id`) REFERENCES `transaction` (`id`),
  ADD CONSTRAINT `transaction_details_ibfk_2` FOREIGN KEY (`barcode`) REFERENCES `product` (`barcode`);
